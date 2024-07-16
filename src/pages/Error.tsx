import {
  Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Button, Center, Heading, Icon, Text, VStack
} from '@chakra-ui/react'
import React from 'react'
import { GrUndo } from 'react-icons/gr'
import { Link, useRouteError } from 'react-router-dom'
import { LogoButton } from '../components/Buttons'
import { RobotIcon } from '../components/Icons'

export default function Error() {
  let error = useRouteError() as any
  return (
      <Center h='full' bg='bg'>
        <VStack p={8} minH='container.sm' justify='space-between' bg='base' rounded='3xl' pos='relative'>
          <LogoButton />
          <VStack>
            <Heading>Oh no, something went wrong...</Heading>
            <Text>{'The page you are looking for does not exist.'}</Text>
          </VStack>
          <Button as={Link} to={-1 as any} variant='solid' size='lg' leftIcon={<GrUndo />}>
            Go Back
          </Button>
          <Icon as={RobotIcon} boxSize='2xs' />
          <Accordion allowToggle w='full' h={24} pos='absolute' bottom={-24} left={0}>
            <AccordionItem fontSize='xs' borderColor='transparent'>
              <AccordionButton fontSize='xs' justifyContent='center'>
                Technical Details
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel as={Center} p={0}>
                <Text w='md'>{error.message}</Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </VStack>
      </Center>
  )
}