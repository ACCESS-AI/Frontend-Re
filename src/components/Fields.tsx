import { Controller, ControllerRenderProps, useFieldArray, useFormContext } from 'react-hook-form'
import {
  Button, Center, CloseButton, Flex, FormControl, FormErrorMessage, FormLabel, HStack, Icon, Input, InputGroup,
  InputProps, InputRightElement, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField,
  NumberInputProps, NumberInputStepper, Select, Stack, Table, Tbody, Td, Textarea, Th, Thead, Tr
} from '@chakra-ui/react'
import { AddIcon, CheckIcon } from '@chakra-ui/icons'
import React, { useRef, useState } from 'react'
import Dropzone from 'react-dropzone'
import { MdOutlineAddPhotoAlternate } from 'react-icons/md'
import * as yup from 'yup'
import { ObjectSchema } from 'yup'
import { camel } from 'radash'
import { get, range } from 'lodash'


export const selectOptions: Record<string, Array<string>> = {
  'Context': ['Task', 'Solution', 'Instructions', 'Grading'], 'Role': ['Supervisor', 'Assistant'],
  'Topic': ['Create a new course on ACCESS', 'Provide feedback', 'Report a technical problem', 'Other']
}

yup.setLocale({
  mixed: { required: '', notType: '' },
  number: { min: '', max: '' },
  string: {
    min: params => params.min === 1 ? '' : `Min. ${params.min} letters`,
    max: params => `Max. ${params.max} letters`,
    email: () => 'Invalid email'
  }
})

const pathSchema = yup.string().min(2).ensure().trim()
    .matches(/^[0-9a-z/._-]+$/i, 'Invalid relative path')
    .test('relative', 'Remove leading "/" character', path => !path || path[0] !== '/')
const fileSchema = yup.object({
  added: yup.boolean().default(false),
  path: yup.string(), templateId: yup.mixed(),
  editable: yup.boolean().default(false).required(),
  context: yup.string().nullable().default(null).when('added',
      { is: true, then: s => s.oneOf(selectOptions['Context'], 'set Use Context for all selecteded file') })
})
const memberSchema = yup.object({
  name: yup.string().ensure().trim().min(2),
  email: yup.string().email().ensure().trim().min(1)
})
const contactSchema = memberSchema.concat(yup.object({
  message: yup.string().ensure().max(500).min(5), topic: yup.string()
}))
const templateSchema = yup.object({ templates: yup.string() })
const courseSchema = yup.object({
  title: yup.string().min(4).max(30).ensure().trim(),
  slug: yup.string().min(8).max(30).ensure().trim().matches(/[0-9a-z]/, 'Lowercase letters, numbers or dash (-) only'),
  startDate: yup.mixed().required(),
  endDate: yup.mixed().required(),
  university: yup.string().min(5).ensure().trim().default('University of Zurich'),
  semester: yup.string().min(5).ensure().trim(),
  description: yup.string().ensure().max(250),
  supervisors: yup.array().of(memberSchema).default([]),
  assistants: yup.array().of(memberSchema).default([]),
  logo: yup.string().ensure().test('image', p => p?.value ? 'Invalid' : 'Required', a => a?.startsWith('data:image'))
})
const assignmentSchema = courseSchema.pick(['title', 'slug', 'startDate', 'endDate', 'description'])
    .concat(yup.object({ ordinalNum: yup.number().min(0).nullable().default(null) }))
const taskSchema = assignmentSchema.pick(['title', 'slug', 'ordinalNum']).concat(yup.object({
  maxPoints: yup.number().default(10).min(0).required(),
  maxAttempts: yup.number().default(3).min(0).max(101).required(),
  attemptRefill: yup.number().min(0).nullable().default(null).transform(value => value || undefined),
  dockerImage: yup.string().ensure().trim().required(),
  timeLimit: yup.number().min(0).max(300).default(30).required(),
  runCommand: yup.string().ensure().trim().required(),
  testCommand: yup.string().ensure().trim(),
  gradeCommand: yup.string().ensure().trim().required(),
  files: yup.array().of(fileSchema).default([])
      .test('hasFile', 'Select at least 1 file', params => !!params?.find(f => f.added))
      .test('hasTask', 'Add at least 1 editable file with "Task" context',
          params => !!params?.find(f => f.added && f.editable && f.context === 'Task'))
      .test('hasInst', 'Add exactly one file with "Instructions" context',
          params => params?.filter(f => f.added && f.context === 'Instructions').length === 1)
}))

export const schemas: Record<string, ObjectSchema<any>> = {
  'courses': courseSchema, 'assignments': assignmentSchema,
  'tasks': taskSchema, 'templates': templateSchema, 'contact': contactSchema
}

export const FormField = ({ name = '', title = '', form = '', max, ...props }: InputProps & NumberInputProps) => {
  const { control } = useFormContext()
  return <Controller name={name || camel(title)} control={control} render={({ field, fieldState }) =>
      <FormControl isInvalid={!!fieldState.error}>
        <HStack w='full' overflow='hidden' align='stretch'>
          <FormLabel textTransform='capitalize' whiteSpace='nowrap'>{title || name}</FormLabel>
          <Flex pos='relative' flexGrow={1}>
            <FormErrorMessage pos='absolute' right={1} top={-1}>{fieldState.error?.message}</FormErrorMessage>
          </Flex>
        </HStack>
        {form === 'text' && <Textarea {...field} />}
        {form === 'number' &&
          <NumberInput min={0} max={max} step={1} precision={0} {...field} {...props}
                       value={field.value || undefined} inputMode='numeric'>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>}
        {!form &&
          <InputGroup {...field}>
            <Input defaultValue={field.value} {...props} />
            <InputRightElement>
              {!fieldState.error && fieldState.isDirty && <CheckIcon color='green.400' />}
            </InputRightElement>
          </InputGroup>}
      </FormControl>} />
}

export const ColumnField = ({ name = '', placeholder = '' }: InputProps) => {
  const { control } = useFormContext()
  return <Controller name={name} control={control} render={({ field, fieldState }) =>
      <FormControl isInvalid={!!fieldState.error}>
        {selectOptions[placeholder] ?
            <Select bg='base' size='sm' minW='max-content' {...field} placeholder='Select'>
              {selectOptions[placeholder].map(o => <option key={o} value={o} label={o} />)}
            </Select> :
            <InputGroup size='sm' {...field}>
              <Input variant='outline' defaultValue={field.value} placeholder={placeholder}
                     _placeholder={{ opacity: 0.7 }} />
              <InputRightElement>
                {!fieldState.error && fieldState.isDirty && <CheckIcon color='green.400' />}
              </InputRightElement>
            </InputGroup>}
      </FormControl>
  } />
}

export const TableField = ({ name = '', title = '', columns }: InputProps & { columns: string[] }) => {
  const { control, formState: { errors } } = useFormContext()
  const { fields, append, remove } = useFieldArray({ name, control })
  return (
      <FormControl as={Stack} flexGrow={1} h='full' overflow='hidden' isInvalid={!!errors[name]} pos='relative' pb={3}>
        <HStack justify='space-between'>
          <FormLabel textTransform='capitalize' whiteSpace='nowrap'>{title || name}</FormLabel>
          <Button size='sm' variant='ghost' onClick={() => append({})}
                  leftIcon={<AddIcon />} children='Add' />
        </HStack>
        <Stack flexGrow={1} overflow='scroll'>
          <Table size='sm' fontSize='sm'>
            <Thead pos='sticky' bg='base' zIndex={1} top={0}>
              <Tr>
                <Th w={3} />
                {columns.map(column => <Th key={column}>{column}</Th>)}
                <Th w={3} />
              </Tr>
            </Thead>
            <Tbody>
              {range(fields.length).map(i =>
                  <Tr key={i}>
                    <Td w={3} p={0}><Center>{i + 1}</Center></Td>
                    {columns.map(column =>
                        <Td key={column} p={0}>
                          <ColumnField name={`${name}.${i}.${camel(column)}`} placeholder={column} />
                        </Td>)}
                    <Td w={3} p={0}><CloseButton ml={1} size='sm' onClick={() => remove(i)} /></Td>
                  </Tr>)}
              <Tr></Tr>
            </Tbody>
          </Table>
        </Stack>
        <FormErrorMessage pos='absolute' bottom={0} right={0}>
          {get(errors, [name, '0', 'message'], '')}
        </FormErrorMessage>
      </FormControl>
  )
}

