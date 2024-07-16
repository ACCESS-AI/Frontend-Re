import { ReactComponent as CourseAlt } from '../assets/course-alt.svg'
import { ReactComponent as File } from '../assets/file.svg'
import { ReactComponent as Folder } from '../assets/folder.svg'
import { ReactComponent as Chatbot } from '../assets/chatbot.svg'
import { ReactComponent as GitHub } from '../assets/github.svg'
import { ReactComponent as FolderOpen } from '../assets/folder-open.svg'
import { ReactComponent as Python } from '../assets/python.svg'
import { ReactComponent as R } from '../assets/r.svg'
import { ReactComponent as Robot } from '../assets/robot.svg'
import { ReactComponent as Test } from '../assets/test.svg'
import { ReactComponent as Run } from '../assets/run.svg'
import { ReactComponent as SWITCH } from '../assets/switch-edu-id.svg'
import { AspectRatio, AvatarProps, Icon, IconProps, Image } from '@chakra-ui/react'
import React from 'react'

export const FolderIcon = Folder
export const RobotIcon = Robot
export const SWITCHIcon = SWITCH
export const GitHubIcon = GitHub

const icons: Record<string, any> =
{
  'Test': Test,
  'Run': Run,
  'python': Python,
  'r': R,
  'md': File,
  'folder-false': Folder,
  'folder-true': FolderOpen,
  'Chatbot': Chatbot
}

export const LanguageIcon = ({ name = '', ...props }: IconProps) => <Icon as={icons[name] || File} {...props} />

export const NodeIcon = ({ name = '', ...props }: IconProps) => <Icon as={icons[name] || File} {...props} />

export const ActionIcon = ({ name = '', ...props }: IconProps) => <Icon as={icons[name] || Run} {...props} />

export const CourseAvatar = ({ src, ...props }: AvatarProps) =>
  <AspectRatio {...props} ratio={1} h='full' minW={36}>
    <Image src={src} fallback={<Icon as={CourseAlt} rounded='2xl' boxSize={36} />} rounded='2xl' />
  </AspectRatio>
