import { Center, CloseButton, HStack, Text, UseDisclosureProps } from '@chakra-ui/react'
import { AnimatePresence, Reorder } from 'framer-motion'
import React from 'react'
import { LanguageIcon } from './Icons'
import { formatPoints, detectType } from '../components/Util'

type FileTabProps = UseDisclosureProps & { file: TaskFileProps }
type FileTabsProps = {
  files: TaskFileProps[], id: number,
  onSelect: (file: TaskFileProps) => void,
  onReorder: (files: TaskFileProps[]) => void
}

export const FileTab = ({ file, isOpen, onOpen, onClose }: FileTabProps) =>
    <Center as={Reorder.Item} value={file} id={file.id.toString()} cursor='pointer' bg='base' borderWidth={1}
            borderBottomWidth={2} borderBottomColor={isOpen ? 'purple.400' : ''} fontFamily='file'
            whileHover={{ opacity: 1 }}
            initial={{ opacity: 0, y: 30 }} exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
            animate={{ opacity: isOpen ? 1 : 0.6, y: 0, transition: { duration: 0.15 } }} whileDrag={{ opacity: 1 }}>
      <HStack p={3} pr={1} onClick={onOpen}>
        <LanguageIcon name={detectType(file.name)} />
        <Text fontSize='sm' lineHeight={1} whiteSpace='nowrap'>{file.name}</Text>
      </HStack>
      <CloseButton mr={1} size='sm' fontSize={9} fontWeight={500} isDisabled={isOpen} onClick={onClose} />
    </Center>

export const FileTabs = ({ files, id, onReorder, onSelect }: FileTabsProps) =>
    <Reorder.Group as='ul' axis='x' onReorder={onReorder} values={files}
                   style={{ display: 'flex', borderBottomWidth: '1px', overflow: 'hidden' }}>
      <AnimatePresence initial={false}>
        {files.map(file =>
            <FileTab key={file.id} file={file} isOpen={file.id === id} onOpen={() => onSelect(file)}
                     onClose={() => onReorder(files.filter(openFile => openFile.id !== file.id))} />)}
      </AnimatePresence>
    </Reorder.Group>
