import { Box, Center, FormLabel, Heading, HStack, Select, Stack, Text, useToast } from '@chakra-ui/react'
import React from 'react'
import { LogoButton, SaveButton } from '../components/Buttons'
import { FormProvider } from 'react-hook-form'
import { FormField, selectOptions } from '../components/Fields'
import { useCreatorForm } from '../components/Hooks'
import { useMutation } from '@tanstack/react-query'

export default function Contact() {
  const { mutateAsync } = useMutation<string, object, any[]>(['contact'])
  const form = useCreatorForm('contact')
  const toast = useToast({ title: 'Message sent!' })
  const onSubmit = form.handleSubmit(data => mutateAsync([['courses', 'contact'], data]).then(() => toast()))
  return (
      <Stack h='100vh' w='100vw'>
        <HStack pos='sticky' w='full' pl={6} pr={3} h={16} justify='space-between'>
          <LogoButton />
        </HStack>
        <Center flexGrow={1}>
          <FormProvider {...form}>
            <Stack as='form' layerStyle='form' onSubmit={onSubmit} w='xl'>
              <Box pt={2}>
                <Heading>{'Get in touch!'}</Heading>
                <Text>{'Send us your message using the form below.'}</Text>
              </Box>
              <Box>
                <FormLabel>Topic</FormLabel>
                <Select bg='bg' {...form.register('topic')}>
                  {selectOptions['Topic'].map(o => <option key={o} value={o} label={o} />)}
                </Select>
              </Box>
              <HStack>
                <FormField title='Name' />
                <FormField title='Email' />
              </HStack>
              <FormField title='Message' form='text' />
              <SaveButton formState={form.formState} children='Send' />
            </Stack>
          </FormProvider>
        </Center>
      </Stack>
  )
}