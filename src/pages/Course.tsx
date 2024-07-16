import {
  Box, Button, Center, Divider, Flex, Grid, GridItem, Heading, HStack, Icon, Stack, Table, TableCaption, TableContainer, Tag, TagLabel, TagLeftIcon, Text, Tbody, Td, Tr, VStack, Wrap
} from '@chakra-ui/react'
import { fork, mapEntries, objectify } from 'radash'
import CourseController from './CourseController'
import React, { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { AiOutlineTeam, AiOutlineCalendar, AiOutlineClockCircle } from 'react-icons/ai'
import { BsFillCircleFill } from 'react-icons/bs'
import { FcAlarmClock, FcBullish, FcLock, FcPlanner, FcCollaboration } from 'react-icons/fc'
import { Link, useOutletContext } from 'react-router-dom'
import { Counter, Detail, EventBox, RankingInfo } from '../components/Buttons'
import { CourseAvatar } from '../components/Icons'
import { Feature, Underline } from '../components/Panels'
import { ScorePie, ScoresPie, TimeCountDown, ScoreBar } from '../components/Statistics'
import { useCourse } from '../components/Hooks'
import { get, groupBy, keys, omit } from 'lodash'
import { format, parseISO } from 'date-fns'
import { SupervisorZone } from './Supervisor'
import { HiOutlineCalendarDays } from 'react-icons/hi2'
import { formatDate, formatDateRange, formatTaskCount } from '../components/Util'
import CourseCreator from './CourseCreator'

export default function Course() {
  const { data: course } = useCourse()
  const { user, isAssistant, isSupervisor } = useOutletContext<UserContext>()
  const [feature, setFeature] = useState({ i: 0, r: 1 })
  const [selectedDay, setSelectedDay] = useState(new Date())

  if (!course)
    return <></>

  const [publishedAssignments, upcomingAssignments] = fork(course.assignments, a => a.published)
  const [activeAssignments, pastAssignments] = fork(publishedAssignments, a => a.active)

  const collectEvents = (prop: string) => groupBy(omit(course.assignments, 'tasks'), a => get(a, prop + 'Date'))
  const events = objectify(['published', 'due'], key => key, key => collectEvents(key))

  return (
      <Grid layerStyle='container' templateColumns='5fr 2fr' templateRows='auto auto 1fr' gap={6}>
        <GridItem as={Flex} gap={4} layerStyle='segment' p={2}>
          <CourseAvatar src={course.logo} />
          <Stack flexGrow={1}>
            <HStack justify='space-between'>
              <Heading fontSize='2xl' noOfLines={1}>{course.information["en"].title}</Heading>
              <Tag color='green.600' bg='green.50'>
                <TagLeftIcon as={BsFillCircleFill} boxSize={2} />
                <TagLabel>{course.onlineCount} Online</TagLabel>
              </Tag>
            </HStack>
            <Wrap>
              <Tag bg='purple.75'>{course.information["en"].university}</Tag>
              {course.supervisors.map(s => <Tag key={s.name}>{s.name}</Tag>)}
            </Wrap>
            <Wrap mt='auto' spacing={4}>
              <Detail as={HiOutlineCalendarDays} title={formatDateRange(course.overrideStart, course.overrideEnd)} />
              <Detail as={AiOutlineTeam} title={`${course.studentsCount} Students`} />
            </Wrap>
            <Text noOfLines={2} fontSize='sm'>{course.information["en"].description}</Text>
          </Stack>
        </GridItem>
        <GridItem as={VStack} p={3} colSpan={1} rowSpan={3} layerStyle='segment' fontSize='sm'>
        {isSupervisor ?
            <GridItem>
              <CourseCreator slug={course.slug} header="Edit source"

              description={`Editing course ${course.slug}: If you moved the course repository or changed the deploy user or webhook token, you may supply updated information here. Be careful, and only do this if you know what you're doing! Do NOT change the course slug (${course.slug}) even when moving repositories.`} />
            </GridItem> : "" }
          <VStack>
          {isSupervisor && <CourseController {...course} />}
          </VStack>
          <VStack>
            <DayPicker mode='single' required selected={selectedDay} showOutsideDays weekStartsOn={1} fixedWeeks
                       onSelect={(_, day) => setSelectedDay(day)} modifiersStyles={{ selected: { color: 'inherit' } }}
                       modifiersClassNames={{ published: 'cal-published', due: 'cal-due' }}
                       footer={<EventBox selected={format(selectedDay, 'yyyy-MM-dd')} events={events} />}
                       modifiers={mapEntries(events, (key, value) => [key, keys(value).map(k => parseISO(k))])} />
          </VStack>
        </GridItem>
        <GridItem as={Stack} layerStyle='container' p={0} spacing={4}>
        {!!upcomingAssignments.length &&
        <TableContainer layerStyle='segment'>
            <HStack>
              <Icon as={FcPlanner} boxSize={6} />
              <Heading fontSize='2xl'>Upcoming Assignments</Heading>
            </HStack>
            <Divider borderColor='gray.300' my={4} />
            <Table>
              <Tbody>
                {upcomingAssignments.map(assignment =>
                    <Tr key={assignment.id}>
                      <Td p={0} whiteSpace='nowrap' fontSize='sm' w='2em' maxW='2em'>{assignment.ordinalNum}</Td>
                      <Td>
                        <VStack>
                          <Heading fontSize='lg'>{assignment.information["en"].title}</Heading>
                          <Text noOfLines={1} fontSize='sm'>{formatTaskCount(assignment.tasks.length)}</Text>
                        </VStack>
                      </Td>
                      <Td w='17em' maxW='17em'>
                        <VStack>
                          <Tag bg='transparent'>
                            <TagLeftIcon as={AiOutlineClockCircle} marginBottom={1} />
                            <TagLabel>{formatDateRange(assignment.start, assignment.end)}</TagLabel>
                          </Tag>
                        </VStack>
                      </Td>
                      <Td w='12em' maxW='12em'>
                        <ScoreBar value={assignment.points} max={assignment.maxPoints} />
                      </Td>
                      <Td w='10em' maxW='10em'>
                        <Button w='full' colorScheme='green' as={Link} to={`assignments/${assignment.slug}`}>
                          {assignment.points ? 'Continue' : 'Show tasks'}
                        </Button>
                      </Td>
                    </Tr>)}
              </Tbody>
            </Table>
          </TableContainer>
          }

        <TableContainer layerStyle='segment'>
          <HStack>
            <Icon as={FcAlarmClock} boxSize={6} />
            <Heading fontSize='2xl'>Active Assignments</Heading>
          </HStack>
          <Divider borderColor='gray.300' my={4} />
          <Table>
            <Tbody>
              {activeAssignments.map(assignment =>
                  <Tr key={assignment.id}>
                    <Td p={0} whiteSpace='nowrap' fontSize='lg' w='2em' maxW='2em'>{assignment.ordinalNum}</Td>
                    <Td>
                      <VStack>
                        <Heading fontSize='lg'>{assignment.information["en"].title}</Heading>
                        <Text noOfLines={1} fontSize='sm'>{formatTaskCount(assignment.tasks.length)}</Text>
                      </VStack>
                    </Td>
                    <Td w='17em' maxW='17em'>
                      <VStack>
                        <Tag bg='transparent'>
                          <TagLeftIcon as={AiOutlineClockCircle} marginBottom={1} />
                          <TagLabel>{formatDateRange(assignment.start, assignment.end)}</TagLabel>
                        </Tag>
                        <TimeCountDown values={assignment.countDown} />
                      </VStack>
                    </Td>
                    <Td w='12em' maxW='12em'>
                      <ScoreBar value={assignment.points} max={assignment.maxPoints} />
                    </Td>
                    <Td w='10em' maxW='10em'>
                      <Button w='full' colorScheme='green' as={Link} to={`assignments/${assignment.slug}`}>
                        {assignment.points ? 'Continue' : 'Show tasks'}
                      </Button>
                    </Td>
                  </Tr>)}
            </Tbody>
            <TableCaption>
              {!activeAssignments.length && <Center minH={28} color='gray.400'>No active assignments found.</Center>}
            </TableCaption>
          </Table>
        </TableContainer>
        <TableContainer layerStyle='segment'>
          <HStack>
            <Icon as={FcLock} boxSize={6} />
            <Heading fontSize='2xl'>Closed Assignments</Heading>
          </HStack>
          <Divider borderColor='gray.300' my={4} />
          <Table>
            <Tbody>
              {pastAssignments.map(assignment =>
                  <Tr key={assignment.id}>
                    <Td p={0} whiteSpace='nowrap' fontSize='lg' w='2em' maxW='2em'>{assignment.ordinalNum}</Td>
                    <Td>
                      <VStack>
                        <Heading fontSize='lg'>{assignment.information["en"].title}</Heading>
                        <Text noOfLines={1} fontSize='sm'>{formatTaskCount(assignment.tasks.length)}</Text>
                      </VStack>
                    </Td>
                    <Td w='17em' maxW='17em'>
                        <Tag bg='transparent'>
                          <TagLeftIcon as={AiOutlineClockCircle} marginBottom={1} />
                          <TagLabel>{formatDateRange(assignment.start, assignment.end)}</TagLabel>
                        </Tag>
                    </Td>
                    <Td w='12em' maxW='12em'>
                      <ScoreBar value={assignment.points} max={assignment.maxPoints} />
                    </Td>
                    <Td w='10em' maxW='10em'>
                      <Button w='full' as={Link} to={`assignments/${assignment.slug}`}>
                        Show tasks
                      </Button>
                    </Td>
                  </Tr>)}
            </Tbody>
            <TableCaption>
              {!pastAssignments.length && <Center minH={28} color='gray.400'>No closed assignments found.</Center>}
            </TableCaption>
          </Table>
        </TableContainer>

        </GridItem>
      </Grid>
  )
}
