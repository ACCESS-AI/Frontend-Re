import {
  Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Badge, Box, Button, ButtonGroup, Center,
  Code, Divider, Flex, HStack, Icon, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader,
  ModalOverlay, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, SimpleGrid, Stack, Tab, TabList,
  TabPanel, TabPanels, Tabs, Tag, Text, useDisclosure, useToast, VStack
} from '@chakra-ui/react'
import Editor from '@monaco-editor/react'
import { format, parseISO } from 'date-fns'
import fileDownload from 'js-file-download'
import JSZip from 'jszip'
import { compact, find, range, unionBy } from 'lodash'
import React, { useEffect, useState } from 'react'
import Countdown from 'react-countdown'
import { AiOutlineBulb, AiOutlineCode, AiOutlineReload } from 'react-icons/ai'
import { BsCircleFill } from 'react-icons/bs'
import { HiDownload } from 'react-icons/hi'
import { useOutletContext } from 'react-router-dom'
import { FileTabs } from '../components/FileTab'
import { FileTree } from '../components/FileTree'
import { Markdown, Placeholder, SplitHorizontal, SplitVertical } from '../components/Panels'
import { ScoreBar, ScorePie } from '../components/Statistics'
import { FcFile, FcInspection, FcTimeline, FcTodoList } from 'react-icons/fc'
import { ActionButton, ActionTab, NextAttemptAt, TooltipIconButton } from '../components/Buttons'
import { useCodeEditor, useTask } from '../components/Hooks'
import { TaskController } from './Supervisor'
import { formatPoints, detectType, createDownloadHref } from '../components/Util'
import { Chatbot } from '../components/chatbot/Chatbot'

export default function Task() {
  const editor = useCodeEditor()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isAssistant, user } = useOutletContext<UserContext>()
  const [submissionId, setSubmissionId] = useState(0)
  const [currentTab, setCurrentTab] = useState(0)
  const [currentFile, setCurrentFile] = useState<TaskFileProps>()
  const [editableFiles, setEditableFiles] = useState<TaskFileProps[]>([])
  const [openFiles, setOpenFiles] = useState<TaskFileProps[]>([])
  const [userId, setUserId] = useState(user.email)
  const { data: task, submit, refetch, timer } = useTask(userId)

  useEffect(() => {
    setCurrentFile(undefined)
    setSubmissionId(0)
  }, [task?.slug, userId])

  const getUpdate = (file: TaskFileProps, submission?: WorkspaceProps) =>
    submission?.files?.find(s => s.taskFileId === file.id)?.content || file.template

  useEffect(() => {
    if (task && !currentFile) {
      const defaultFiles = task.files.filter(file => file.editable)
      setEditableFiles(defaultFiles)
      setOpenFiles(defaultFiles)
      setCurrentFile(defaultFiles[0])
    }
  }, [currentFile, task])

  useEffect(() => {
    if (task && task.submissions.length > 0) {
      const submission = task.submissions[0]
      const updatedFiles = editableFiles.map(file => ({ ...file, content: getUpdate(file, submission) }))
      setOpenFiles(files => files.map(file => find(updatedFiles, { id: file.id }) || file))
      setCurrentFile(file => file && find(updatedFiles, { id: file.id }))
    }
  }, [editableFiles])

  useEffect(() => {
    if (currentFile)
      setOpenFiles(files => unionBy(files, [currentFile], 'id'))
  }, [currentFile])

  if (!task || !currentFile)
    return <Placeholder />

  const commands: string[] = compact([task.testable && 'test', 'run', 'grade', 'chatbot'])
  const isPrivileged = isAssistant && userId === user.email
  const getPath = (id: number) => `${id}/${user.email}/${submissionId}`
  const getTemplate = (name: string) => {
    if (!name.startsWith("/")) { name = "/" + name }
    const file = find(task?.files, { path: name })
    if (!file) return ''
    return `data:${file.mimeType};base64,` + file.templateBinary
  }
  const getContent = (file: TaskFileProps) => editor.getContent(getPath(file.id)) || file.template
  const onSubmit = (command: string) => () => submit({
    restricted: !isAssistant, command, files: editableFiles.map(f => ({ taskFileId: f.id, content: getContent(f) }))
  }).then(() => setCurrentTab(commands.indexOf(command))).then(onClose)

  const refill = () => toast({ title: '+1 attempt! Refreshing...', duration: 3000, onCloseComplete: refetch })

  const reload = (submission: SubmissionProps) => {
    toast({ title: 'Reloaded ' + submission.name, isClosable: true })
    const updatedFiles = editableFiles.map(file => ({ ...file, content: getUpdate(file, submission) }))
    setOpenFiles(files => files.map(file => find(updatedFiles, { id: file.id }) || file))
    setCurrentFile(file => file && find(updatedFiles, { id: file.id }))
    setEditableFiles(updatedFiles)
    setSubmissionId(submission.id)
  }

  const reset = () => {
    toast({ title: 'Reset files to template', isClosable: true })
    setOpenFiles(files => files.map(file => ({ ...file, content: file.template })))
    setCurrentFile(file => file && ({ ...file, content: file.template }))
    setSubmissionId(-1)
  }


  return (
    <Flex boxSize='full'>
      <ButtonGroup layerStyle='float' pos='absolute' variant='ghost' top={2} right={20} isAttached zIndex={2}>
        {task.testable &&
          <ActionButton name='Test' color='gray.600' isLoading={!!timer} onClick={onSubmit('test')} />}
        <ActionButton name='Run' color='gray.600' isLoading={!!timer} onClick={onSubmit('run')} />
        <Button colorScheme='green' leftIcon={<FcInspection />} onClick={onOpen} children='Submit'
          isDisabled={!!timer || (!isAssistant && (task.remainingAttempts <= 0))} />
        <Modal size='sm' isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={!timer}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Text textAlign='center' color='purple.600'>Confirm Submission</Text>
              <ModalCloseButton />
            </ModalHeader>
            <ModalBody>
              <VStack p={3} justify='space-between' fontSize='lg'>
                <Text textAlign='center'>Are you sure you want to submit?</Text>
                <Flex h={10}>
                  {!!timer &&
                    <Countdown date={timer} daysInHours renderer={({ formatted }) =>
                      <Text>Time Remaining: <b>{formatted.minutes}:{formatted.seconds}</b></Text>} />}
                </Flex>
                <ButtonGroup>
                  <Button isLoading={!!timer} onClick={onClose} variant='outline' children='Cancel' />
                  <Button isLoading={!!timer} onClick={onSubmit('grade')} children='Submit' />
                </ButtonGroup>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </ButtonGroup>
      <SplitVertical bg='base' borderTopWidth={1}>
        <Stack h='full' spacing={0} overflow='hidden' >
          {isAssistant && <TaskController value={userId} defaultValue={user.email} onChange={setUserId} />}
          <Accordion display='flex' flexDir='column' flexGrow={1} overflow='hidden'
            allowMultiple defaultIndex={[0, 1]}>
            <AccordionItem display='flex' flexDir='column' overflow='hidden'>
              <AccordionButton>
                <AccordionIcon />
                <FcTodoList />
                <Text>Instructions</Text>
              </AccordionButton>
              <AccordionPanel p={2} pr={0} overflowY='scroll' motionProps={{ style: { display: 'flex' } }}>
                <Markdown children={task.files.filter(file => file.path === `/${task.information["en"].instructionsFile}`)[0].template} transformImageUri={getTemplate} />
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem borderBottomColor='transparent' pos='relative'>
              <AccordionButton>
                <AccordionIcon />
                <FcFile />
                <Text>Files</Text>
              </AccordionButton>
              <ButtonGroup variant='ghost' size='sm' colorScheme='blackAlpha' pos='absolute' right={3} top={1}>
                <IconButton icon={<Icon as={HiDownload} boxSize={5} />} aria-label='download' onClick={() => {
                  let zip = new JSZip()
                  task.files.filter(file => !file.editable).forEach(file => zip.file(`${task.slug}${file.path}`, file.template))
                  editableFiles.forEach(file => zip.file(`${task.slug}${file.path}`, getContent(file)))
                  zip.generateAsync({ type: 'blob' }).then(b => fileDownload(b, task.slug + '.zip'))
                }} />
              </ButtonGroup>
              <AccordionPanel p={0}>
                <FileTree files={task.files} selected={currentFile.path}
                  onSelect={file => setCurrentFile(find(editableFiles, { id: file.id }) || file)} />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Stack>
        <SplitHorizontal>
          <FileTabs id={currentFile.id} files={openFiles} onSelect={setCurrentFile} onReorder={setOpenFiles} />
          {currentFile.binary ||
            <Editor path={getPath(currentFile.id)} language={detectType(currentFile.name)}
              defaultValue={currentFile.content || currentFile.template}
              options={{ minimap: { enabled: false }, readOnly: !currentFile.editable }} />
          }
          {currentFile.binary &&
            <Center position='absolute' top={0} zIndex={currentFile.binary ? 1 : -2} bg='base'>
              {<Image src={`data:${currentFile.mimeType};base64,` + currentFile.templateBinary} h='auto' w='auto' />}
            </Center>
          }
          <Tabs display='flex' flexDir='column' flexGrow={1} colorScheme='purple'
            borderTopWidth={1} index={currentTab} onChange={setCurrentTab}>
            <TabList overflow='hidden'>
              {task.testable && <Tab><ActionTab name='Test' /></Tab>}
              <Tab><ActionTab name='Run' /></Tab>
              <Tab><HStack><FcInspection /><Text>Submit</Text></HStack></Tab>
              <Tab><ActionTab name='Chatbot' /></Tab>
            </TabList>
            <TabPanels flexGrow={1} pos='relative'>
              {commands.map(command =>
                <TabPanel key={command} layerStyle='tab'>
                  {(command == 'chatbot') ?
                    <Chatbot></Chatbot>
                    :
                    task.submissions.filter(s => s.command === command).map(submission =>
                      <Box key={submission.id}>
                        <HStack align='start'>
                          <Code color='orange.300'>{'>'}</Code>
                          <Code fontWeight={700} whiteSpace='pre-wrap'>{submission.name}</Code>
                        </HStack>
                        <HStack align='start'>
                          <Code color='orange.300'>$</Code>
                          <Code whiteSpace='pre-wrap' opacity={submission.output ? 1 : 0.8}>
                            {submission.output || 'No output'}
                          </Code>
                        </HStack>
                        {submission.persistentResultFiles.map(file =>
                          <HStack align='start'>
                            <Code color='orange.300'>{'-'}</Code>
                            <VStack align='start' spacing={0}>
                              <React.Fragment key={file.path}>
                                <Code whiteSpace='pre-wrap'>File <a
                                  href={createDownloadHref(file)}
                                  download={file.path.split('/').pop()}
                                  style={{ color: 'purple', textDecoration: 'underline' }}>{file.path}</a>:</Code>
                                {file.binary && (
                                  (() => {
                                    switch (detectType(file.path)) {
                                      case 'jpg':
                                      case 'png':
                                        return <Image src={`data:${file.mimeType};base64,${file.contentBinary}`} h='auto' w='auto' />;
                                      default:
                                        return <Code>Cannot render inline, download by clicking on the filename above</Code>;
                                    }
                                  })()
                                ) || (
                                    <Code whiteSpace='pre-wrap'>{file.content}</Code>
                                  )}
                              </React.Fragment>
                            </VStack>
                          </HStack>
                        )}
                      </Box>)}
                </TabPanel>)}
            </TabPanels>
          </Tabs>
        </SplitHorizontal>
        <Stack pos='sticky' minW='3xs' h='full' spacing={0}>
          {!isPrivileged && task.remainingAttempts <= 0 && task.nextAttemptAt &&
            <NextAttemptAt date={task.nextAttemptAt} onComplete={refill} />}
          <SimpleGrid columns={2} w='full' fontSize='sm'>
            <VStack borderRightWidth={1} spacing={0} h={32} pb={2}>
              <ScorePie value={task.points} max={task.maxPoints} />
              <Tag size='sm' colorScheme='purple' fontWeight={400} bg='purple.50'>Score</Tag>
            </VStack>
            <VStack h={32} p={2}>
              <SimpleGrid columns={Math.min(task.maxAttempts, 5)} gap={1} flexGrow={1} alignItems='center'>
                {range(Math.min(task.maxAttempts, 10)).map(i =>
                  <Center key={i} rounded='full' boxSize={4} borderWidth={2} borderColor='purple.400'
                    bg={(isPrivileged || i < task.remainingAttempts) ? 'gradients.500' : 'transparent'} />)}
              </SimpleGrid>
              <Text fontSize='lg'><b>{isPrivileged ? '∞' : task.remainingAttempts}</b> / {task.maxAttempts}</Text>
              <Tag size='sm' colorScheme='purple' fontWeight={400} bg='purple.50'>Submissions</Tag>
            </VStack>
          </SimpleGrid>
          <Accordion allowMultiple defaultIndex={[0]} overflow='hidden' flexGrow={1}>
            <AccordionItem boxSize='full'>
              <AccordionButton>
                <AccordionIcon />
                <FcTimeline />
                <Text>History</Text>
              </AccordionButton>
              <AccordionPanel motionProps={{ style: { display: 'flex', maxHeight: '100%' } }}
                p={0} flexGrow={1} overflow='scroll'>
                {task.submissions.map(submission =>
                  <SimpleGrid templateColumns='1rem 1fr auto' templateRows='auto auto' key={submission.id}
                    fontSize='sm' justifyItems='stretch' justifyContent='space-between'>
                    <VStack gridRow='span 2'>
                      <Icon as={BsCircleFill} mx={2} mt={1} boxSize={2} color='purple.500' />
                      <Divider orientation='vertical' borderColor='gray.500' />
                    </VStack>
                    <Box>
                      <Text lineHeight={1.2} fontWeight={500}>{submission.name}</Text>
                      <Text fontSize='2xs'>
                        {format(parseISO(submission.createdAt), 'dd.MM.yyyy HH:mm')}
                      </Text>
                      {!submission.valid && <Badge colorScheme='red' mr={1}>Invalid</Badge>}
                      {submission.createdAt > task.deadline && <Badge colorScheme='purple' mr={1}>Late</Badge>}
                    </Box>
                    <ButtonGroup size='sm' variant='ghost' spacing={1}>
                      <Popover placement='left'>
                        <PopoverTrigger>
                          <IconButton isDisabled={!submission.output} bg='gray.10' color='contra' rounded='md'
                            aria-label={submission.graded ? 'Hint' : 'Output'} fontSize='120%'
                            icon={submission.graded ? <AiOutlineBulb /> : <AiOutlineCode />} />
                        </PopoverTrigger>
                        <PopoverContent w='fit-content' maxW='xl' bg='yellow.50'>
                          <PopoverArrow />
                          <PopoverBody overflow='auto' fontSize='sm' whiteSpace='pre-wrap' maxH='2xs'>
                            {submission.output}
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                      <TooltipIconButton onClick={() => reload(submission)} aria-label='Reload' bg='gray.10'
                        color='contra' icon={<AiOutlineReload />} />
                    </ButtonGroup>
                    <Stack gridColumn='span 2' py={2} mb={4}>
                      {submission.graded && submission.valid &&
                        <ScoreBar value={submission.points} max={submission.maxPoints} h={6} />}
                    </Stack>
                  </SimpleGrid>)}
                <Flex gap={2} fontSize='sm'>
                  <VStack w={4}>
                    <Icon as={BsCircleFill} mx={2} mt={1} boxSize={2} color='purple.500' />
                    <Divider orientation='vertical' borderColor='gray.500' />
                  </VStack>
                  <Stack mb={8}>
                    <Text lineHeight={1.2} fontWeight={500}>Started task.</Text>
                    <Button size='xs' leftIcon={<AiOutlineReload />} onClick={reset}>Reset</Button>
                  </Stack>
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Stack>
      </SplitVertical>
    </Flex>
  )
}
