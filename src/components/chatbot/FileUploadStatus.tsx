import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, Icon, Divider, Tooltip, Spinner } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query'
import { useStatus } from '../Hooks';
import { FiFrown } from 'react-icons/fi'
import { get } from 'lodash';


export const FileUploadStatus = () => {
    const { data: courses } = useQuery<CourseOverview[]>(['courses'])
    const [statusArray, setStatusArray] = useState<Array<CourseFilesUploadStatusI | undefined>>([]);
    const { query } = useStatus({ courseSlugs: courses?.map(course => course.slug) ?? '' });
    const [time, setTime] = useState<number>(0);

    useEffect(() => {
        if (query.data) {
            if (query.data.length > 0) {
                let statusArray: Array<CourseFilesUploadStatusI | undefined> = [];
                query.data.forEach((status: CourseFilesUploadStatusI, index: number) => {
                    let courseStatus: CourseFilesUploadStatusI = {
                        courseSlug: query.data[index].courseSlug,
                        status: query.data[index].status
                    };
                    statusArray.push(courseStatus);
                });
                setStatusArray(statusArray);
            }
        }
    }, [query.data]);


    const getColor = (successfullFiles: string[], unsuccessfullFiles: string[]): string => {
        let color: string;

        if (unsuccessfullFiles.length === 0) {
            color = 'green';
        } else if (unsuccessfullFiles.length != 0 && successfullFiles.length != 0) {
            color = 'yellow';
        } else
            color = 'red';

        return color;
    }

    if (query.isLoading) {
        return (
            <VStack justify='center' spacing={4} minH='xs' color='blackAlpha.400'>
                <Spinner></Spinner>
                <Text>Loading!</Text>
            </VStack>
        );
    }

    if (query.isError) {
        return (
            <VStack justify='center' spacing={4} minH='xs' color='blackAlpha.400'>
                <Icon as={FiFrown} boxSize={16} opacity={0.3} />
                {courses?.length === 0 ?
                    <Text>No courses found.</Text>
                    : <Text>Something went wrong!</Text>
                }
            </VStack>
        );
    }


    return (
        <Box overflow='auto'>
            <VStack justify='start' spacing={4} minH='xs' color='blackAlpha.800'>
                {statusArray.map((s, index) => {
                    if (s) {
                        let color = getColor(s.status.successfullFiles, s.status.unsuccessfullFiles)
                        return (
                            <Box key={index} border="2px solid" padding="8px 12px" bg={color + '.200'} borderColor={color + '.500'} borderRadius="8px" width='90%'>
                                <Text>{s.courseSlug}</Text>
                                <Tooltip
                                    background='white'
                                    borderRadius='lg'
                                    label={
                                        <VStack align='start' padding='8px'>
                                            {s.status.successfullFiles.map((fileName, index) => {
                                                return (
                                                    <Text key={index} color='green.500' fontSize="s">
                                                        {fileName}
                                                    </Text>
                                                )
                                            })}
                                            {s.status.successfullFiles.length == 0 || s.status.unsuccessfullFiles.length == 0 ?
                                                <></> : <Divider borderColor='blackAlpha.600' />
                                            }
                                            {s.status.unsuccessfullFiles.map((fileName, index) => {
                                                return (
                                                    <Text key={index} color='red.500' fontSize="s">
                                                        {fileName}
                                                    </Text>
                                                )
                                            })}
                                        </VStack>
                                    }
                                >
                                    <Box>{`${s.status.successfullFiles.length} out of ${s.status.successfullFiles.length + s.status.unsuccessfullFiles.length} successful`}</Box>
                                </Tooltip>
                            </Box>
                        );
                    }
                    else return (<></>);
                })
                }
            </VStack>
        </Box>
    );
}