import {
    Box,
    Text,
    Spinner,
    Flex,
    Tooltip,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button
} from '@chakra-ui/react';
import { Markdown } from '../Panels';
import { useOutletContext } from 'react-router-dom';

const ChatMessage = ({ message, index }: { message: MessageI | undefined; index: number }) => {
    const { isAssistant, user } = useOutletContext<UserContext>()
    const isUser = message?.type === 'user';

    const { isOpen, onOpen, onClose } = useDisclosure()

    const processMetadata = (metadata: MetadataI[]): string => {
        let metadataString = '';

        metadata.forEach((meta, index) => {
            metadataString += `${meta.source} - Pages ${meta.pages}${index === metadata.length - 1 ? '' : ''}\n`;
        });

        return metadataString;
    };

    return (
        <Box
            key={index}
            py="10px"
            display="flex"
            justifyContent={isUser ? 'flex-end' : 'flex-start'}
        >
            {message === undefined ? (
                <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color={isUser ? 'blackAlpha.700' : 'purple.500'}
                    size="md"
                    mr="2"
                />
            ) : (
                <Box
                    borderRadius="md"
                    bg={isUser ? 'blackAlpha.100' : 'purple.100'}
                    p="8px"
                    maxWidth="75%"
                    width="auto"
                    display="flex"
                    flexDirection="column"
                    boxShadow="md"
                >
                    {/* message */}
                    <Text
                        color={isUser ? 'blackAlpha.700' : 'purple.600'} wordBreak="break-word" whiteSpace="pre-line">
                        {isUser ? message.message : <Markdown children={message.message} />}
                    </Text>
                    <Flex flexDirection={isUser ? 'row-reverse' : 'row'} justifyContent="space-between" alignItems="end">
                        {/* timestamp */}
                        <Text color="gray.500" fontSize="xs" height="fit-content">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                        {!isUser &&
                            <>
                                {/* final prompt */}
                                {isAssistant && message.finalPrompt &&
                                    <>
                                        <Box borderRadius="md" bg="blackAlpha.200" p="1px" cursor={"pointer"} onClick={onOpen}>📝</Box>

                                        <Modal isOpen={isOpen} onClose={onClose} size={"xxl"}>
                                            <ModalOverlay />
                                            <ModalContent>
                                                <ModalHeader>Final Prompt Passed to LLM</ModalHeader>
                                                <ModalCloseButton />
                                                <ModalBody>
                                                    <Text
                                                        color={"blackAlpha.700"} wordBreak="break-word" whiteSpace="pre-line">
                                                        {message.finalPrompt}
                                                    </Text>
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button colorScheme='purple' mr={3} onClick={onClose}>
                                                        Close
                                                    </Button>
                                                </ModalFooter>
                                            </ModalContent>
                                        </Modal>
                                    </>
                                }
                                {/* metadata */}
                                {message.metadata && message.metadata.length > 0 &&
                                    <Tooltip
                                        background={"gray.200"}
                                        boxShadow={"0 6px 12px 0 rgba(0,0,0,0.3)"}
                                        color="gray.500"
                                        label={message.metadata?.map((meta, index) => {
                                            return (
                                                <Text key={index} fontSize="s">
                                                    <b>{meta.source}</b>{meta.pages != null ? ` (Page${!meta.pages.includes(',') ? '' : 's'}: ${meta.pages})` : ''}
                                                </Text>
                                            )
                                        })}
                                    >
                                        <Box borderRadius="md" bg="blackAlpha.200" p="1px" cursor={"pointer"}>🔎</Box>
                                    </Tooltip>
                                }
                            </>
                        }
                    </Flex>
                </Box>
            )
            }
        </Box >
    );
};

export default ChatMessage;
