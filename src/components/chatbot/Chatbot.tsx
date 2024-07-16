import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, Textarea } from '@chakra-ui/react';
import { useChatbot } from '../Hooks';
import ChatMessage from './ChatMessage';
import { set, update } from 'lodash';
import { useOutletContext } from 'react-router-dom';

export const Chatbot = () => {
    const [inputText, setInputText] = useState<string>('');
    const [inputSize, setInputSize] = useState(0);
    const [messageArray, setMessageArray] = useState<Array<MessageI | undefined>>([]);
    const { isAssistant, user } = useOutletContext<UserContext>()
    const { query, submit } = useChatbot(user.email);


    const INPUT_LIMIT = 4000;

    useEffect(() => {
        if (query.data) {
            let messages: MessageI[] = [];
            for (let i = 0; i < query.data.length; i += 2) {
                messages.push({ type: 'user', message: query.data[i].message, timestamp: new Date(), metadata: undefined, finalPrompt: undefined });
                messages.push({
                    type: 'access',
                    message: query.data[i + 1].message,
                    timestamp: new Date(query.data[i + 1].timestamp),
                    metadata: query.data[i + 1].metadata,
                    finalPrompt: query.data[i + 1].finalPrompt
                });
            }
            setMessageArray(messages);
        }
    }, [query.data]);

    const processResponse = (response: MessageI | undefined) => {
        setMessageArray(prevMessages => {
            // Remove previous undefined message if there is one
            const filteredMessages = prevMessages.filter(message => message !== undefined);

            return [...filteredMessages, response];
        });
        setInputText(''); // Resetting input
        setInputSize(0); // Resetting input size
    };

    const handleKeyPress = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (inputText.trim().length != 0 && event.key === 'Enter') {
            if (event.shiftKey) {
                return;
            }
            processResponse({ type: 'user', message: inputText, timestamp: new Date(), metadata: undefined, finalPrompt: undefined });
            processResponse(undefined); // Add a placeholder for the bot's response

            var answer = await submit({ prompt: inputText })
            // var answer = { llmOutput: `Hello, I am a chatbot.\n How can I help you?`, llmTimestamp: new Date(), metadata: [{ source: "Book 3", pages: "1,2" }] }

            processResponse({ type: 'access', message: answer.llmOutput ?? 'Something went wrong', timestamp: new Date(answer.llmTimestamp), metadata: answer.metadata, finalPrompt: answer.finalPrompt });
        }
    };

    const setNewInputText = (newInputText: string) => {
        setInputText(newInputText);
        setInputSize(newInputText.length);
    };

    const autoGrowInput = (element: HTMLTextAreaElement) => {
        element.style.height = "5px";
        element.style.height = (element.scrollHeight) + "px";
    }

    return (
        <Box id="chat-container" fontFamily="Arial, sans-serif">
            <Box id="message-area" color="blackAlpha.700" padding="10px">
                {messageArray.map((message, index) => {
                    let showDate = false;
                    const currentTimestamp = message?.timestamp ? new Date(message.timestamp) : null;
                    const previousTimestamp = messageArray[index - 1]?.timestamp ? new Date(messageArray[index - 1]!.timestamp) : null;

                    // Function to check if the date is today
                    const isToday = (someDate: Date) => {
                        const today = new Date();
                        return someDate.getDate() === today.getDate() &&
                            someDate.getMonth() === today.getMonth() &&
                            someDate.getFullYear() === today.getFullYear();
                    };

                    // Function to check if the date is yesterday
                    const isYesterday = (someDate: Date) => {
                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);
                        return someDate.getDate() === yesterday.getDate() &&
                            someDate.getMonth() === yesterday.getMonth() &&
                            someDate.getFullYear() === yesterday.getFullYear();
                    };

                    if (index === 0 || (currentTimestamp && previousTimestamp && !isToday(currentTimestamp) && !isYesterday(currentTimestamp))) {
                        showDate = true;
                    }

                    return (
                        <Box key={index}>
                            {/* date */}
                            {showDate && currentTimestamp && (
                                <Box textAlign="center" marginBottom="10px">
                                    <Text>
                                        {isToday(currentTimestamp) && "Today"}
                                        {isYesterday(currentTimestamp) && "Yesterday"}
                                        {!isToday(currentTimestamp) && !isYesterday(currentTimestamp) && `${currentTimestamp!.getDate()}/${currentTimestamp!.getMonth() + 1}/${currentTimestamp!.getFullYear()}`}
                                    </Text>
                                </Box>
                            )}
                            {/* message */}
                            <ChatMessage key={index} message={message} index={index} />
                        </Box>
                    );
                })}
            </Box>
            <Box id="input-area" display="flex" flexDirection="column" alignItems="center" justifyContent="space-between" bottom="0" width="100%" padding="5px 10px 0px 10px" boxShadow="md" bg="white" borderRadius="lg">
                <Box display="flex" alignItems="center" width="100%">
                    <Text color="purple.500" fontSize="xl" marginRight="10px">{">"}</Text>
                    <Textarea
                        value={inputText}
                        placeholder='Type something and press Enter'
                        onChange={(e) => {
                            if (e.target.value.length <= INPUT_LIMIT) {
                                setNewInputText(e.target.value);
                            } else {
                                setNewInputText(e.target.value.slice(0, INPUT_LIMIT));
                                // set user selection to the end of the input and delete spaces
                                const inputElement = e.target as HTMLTextAreaElement;
                                inputElement.selectionStart = inputElement.selectionEnd = INPUT_LIMIT;
                            }
                        }}
                        onInput={(e) => autoGrowInput(e.currentTarget)}
                        onKeyDown={handleKeyPress}
                        size='md'
                        resize='none'
                        minHeight='auto'
                        maxHeight='200px'
                    />
                </Box>
                <Text color="gray.500" fontSize="sm" lineHeight="shorter" alignSelf="end">{inputSize}/{INPUT_LIMIT}</Text>
            </Box>
        </Box>
    );

}
