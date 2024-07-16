import { Center, Heading, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr, VStack } from '@chakra-ui/react'
import React from 'react'
import { useStudentPoints } from '../components/Hooks'

export default function Students() {
  const { data: students } = useStudentPoints()
  if (!students)
    return <></>
  return (
    <VStack>
      <TableContainer p={8} my={4} layerStyle='segment'>
        <Heading m={2} mt={0} fontSize='3xl'>{students.length} Students</Heading>
        <Table maxW='container.sm'>
          <Thead>
            <Tr>
              <Th>Registration ID</Th>
              <Th>Username</Th>
              <Th>Last Name</Th>
              <Th>First Name</Th>
              <Th>Email</Th>
              <Th>Points</Th>
            </Tr>
          </Thead>
          <Tbody>
            {students.map(student =>
                <Tr key={student.email}>
                  <Td>{student.registrationId}</Td>
                  <Td>{student.username}</Td>
                  <Td>{student.lastName}</Td>
                  <Td>{student.firstName}</Td>
                  <Td>{student.email}</Td>
                  <Td>{student.points}</Td>
                </Tr>)}
          </Tbody>
          <TableCaption>
            {!students.length && <Center color='gray.400'>No students found.</Center>}
          </TableCaption>
        </Table>
      </TableContainer>
    </VStack>
  )
}
