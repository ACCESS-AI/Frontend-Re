import {
  Box, Button, Center, Divider, Flex, Heading, HStack, Icon, SimpleGrid, Stack, Table, TableContainer, Tag, TagLabel,
  TagLeftIcon, Tbody, Td, Text, Tr, Wrap, VStack
} from '@chakra-ui/react'
import { range } from 'lodash'
import React from 'react'
import { AiOutlineCalendar } from 'react-icons/ai'
import { FcTodoList } from 'react-icons/fc'
import { Link, useOutletContext } from 'react-router-dom'
import { Counter } from '../components/Buttons'
import { HScores, TimeCountDown } from '../components/Statistics'
import { useAssignment } from '../components/Hooks'
import { formatDate, formatDateRange } from '../components/Util'

export default function Assignment() {
  const { isAssistant } = useOutletContext<UserContext>()
  const { data: assignment } = useAssignment()

  if (!assignment)
    return <></>

  return (
      <Stack layerStyle='container' spacing={4}>
        <Stack layerStyle='segment'>
          <Flex justify='space-between'>
            <Box>
              <Text>ASSIGNMENT {assignment.ordinalNum}</Text>
              <Heading>{assignment.information["en"].title}</Heading>
              <Wrap my={2}>
                <Tag>{assignment.tasks.length} Tasks</Tag>
                <Tag>
                  <TagLeftIcon as={AiOutlineCalendar} />
                  <TagLabel>{formatDateRange(assignment.start, assignment.end)}</TagLabel>
                </Tag>
                <Tag colorScheme={assignment.active ? 'green' : 'purple'}>
                  Submission {assignment.active ? 'Open' : 'Closed'}
                </Tag>
              </Wrap>
            </Box>
            <Center pr='1em'>
            {assignment.active && <TimeCountDown values={assignment.countDown} />}
            </Center>
          </Flex>
        </Stack>
        <TableContainer layerStyle='segment'>
          <HStack>
            <Icon as={FcTodoList} boxSize={6} />
            <Heading fontSize='2xl'>Tasks</Heading>
            <Counter>{assignment.tasks.length}</Counter>
          </HStack>
          <Divider borderColor='gray.300' my={4} />
          <Table>
            <Tbody>
              {assignment.tasks.sort((a,b) => a.ordinalNum - b.ordinalNum).map(task =>
                  <Tr key={task.id}>
                    <Td p={0} whiteSpace='nowrap' fontSize='sm'>{task.ordinalNum}</Td>
                    <Td>
                      <Heading fontSize='lg'>{task.information["en"].title}</Heading>
                    </Td>
                    {assignment.active &&
                    <Td>
                      <SimpleGrid columns={5} gap={1} w='fit-content'>
                        {range(Math.min(task.maxAttempts, 10)).map(i =>
                            <Center key={i} rounded='full' boxSize={5} borderWidth={2} borderColor='purple.500'
                                    bg={(isAssistant || i < task.remainingAttempts) ? 'purple.500' : 'transparent'} />)}
                      </SimpleGrid>
                      <Text fontSize='sm'>
                        <b>{isAssistant ? '∞' : task.remainingAttempts}</b> / {task.maxAttempts} Submissions left
                      </Text>
                    </Td> || <Td>submission closed</Td>
                    }
                    <Td w='xs'>
                      <HScores value={task.points} max={task.maxPoints} />
                    </Td>
                    <Td>
                      <Button w='full' as={Link} to={`tasks/${task.slug}`}>
                      View
                      </Button>
                    </Td>
                  </Tr>)}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
  )
}
