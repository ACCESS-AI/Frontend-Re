import { Button, ButtonGroup, Container, Flex, FormLabel, FormControl, Heading,
         Input, InputGroup, InputLeftElement, Modal, ModalBody,
         ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text,
         VStack, useDisclosure } from '@chakra-ui/react'
import { AiOutlineAudit, AiOutlineGithub } from 'react-icons/ai'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GitHubIcon } from '../components/Icons'
import { useCreate } from '../components/Hooks'

export default function CourseCreator(
  {slug = '',
   repository = '',
   repositoryUser = '',
   repositoryPassword = '',
   webhookSecret = '',
   header = '',
   description = '',
  }: CourseMetaProps) {
  const { isOpen, onOpen, onClose } = useDisclosure({ onClose: () => window.location.reload() })
  const { mutate, isLoading }= useCreate(slug)
  const [course, setCourse] = useState(
    {slug: slug, repository: repository, repositoryUser: repositoryUser,
     repositoryPassword: repositoryPassword, webhookSecret: webhookSecret})

  return (
      <ButtonGroup  w='full' variant='gradient'>
        <Button w='full' leftIcon={<AiOutlineGithub />} onClick={onOpen}>{header}</Button>
        <Modal isOpen={isOpen} onClose={onClose} isCentered size='xl'>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Text textAlign='center' color='purple.600'>{header}</Text>
              <ModalCloseButton />
            </ModalHeader>
            <ModalBody as={VStack} justifyContent='center' spacing={4} py={4} px={10}>
              <GitHubIcon />
              <Text color='gray.600' lineHeight={1.5}>
                {description}
              </Text>
              <FormControl isRequired>
                <FormLabel>
                  Course Repository URL (https):
                </FormLabel>
                <Input value={course.repository} onChange={e => setCourse({...course, repository: e.target.value})} type='text' />
              </FormControl>
              <Text color='gray.600' lineHeight={1.5}>
                You may manually set a course slug. This makes sense if you want to import the same course more than once. If you leave this field empty, the slug specified in the courses config.toml will be used. Do NOT change the course slug for existing courses, unless you know what you're doing.
              </Text>
              <FormControl>
                <FormLabel>
                  Course slug:
                </FormLabel>
                <Input value={course.slug} onChange={e => setCourse({...course, slug: e.target.value})} type='text' />
              </FormControl>
              <Text color='gray.600' lineHeight={1.5}>
                If the repository is private, provide a username and password. Note that you should not use your personal account credentials; instead, create a deploy token!
              </Text>
              <FormControl>
                <FormLabel> Git username: </FormLabel>
                <Input value={course.repositoryUser} onChange={e => setCourse({...course, repositoryUser: e.target.value})} type='text' />
              </FormControl>
              <FormControl>
                <FormLabel> Git password: </FormLabel>
                <Input value={course.repositoryPassword} onChange={e => setCourse({...course, repositoryPassword: e.target.value})} type='text' />
              </FormControl>
              <Text color='gray.600' lineHeight={1.5}>
                If you wish to configure a webhook for updating the repository automatically, provide the webhook secret here:
              </Text>
              <FormControl>
                <FormLabel> Git webhook secret/token: </FormLabel>
                <Input value={course.webhookSecret} onChange={e => setCourse({...course, webhookSecret: e.target.value})} type='text' />
              </FormControl>
                <Button variant='round' onClick={() => mutate({...course})} isLoading={isLoading}> Submit </Button>
            </ModalBody>
          </ModalContent>
        </Modal>
      </ButtonGroup>
  )
}
