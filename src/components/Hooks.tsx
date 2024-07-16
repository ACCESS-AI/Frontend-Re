import { useMonaco } from '@monaco-editor/react'
import { Uri } from 'monaco-editor'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query'
import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { compact, concat, flatten, join, flattenDeep } from 'lodash'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { schemas } from './Fields'

export const useCodeEditor = () => {
  const monaco = useMonaco()
  const getContent = (path: string) => monaco?.editor.getModel(Uri.file(path))?.getValue()
  return { getContent }
}

const usePath = (prefix: string): any[] => {
  const { courseSlug, assignmentSlug, taskSlug } = useParams()
  return compact(flatten(concat('courses', courseSlug, prefix !== 'courses' &&
    ['assignments', assignmentSlug, prefix !== 'assignments' && ['tasks', taskSlug]])))
}

export const useCreatorForm = (prefix: string) =>
  useForm({ mode: 'onChange', resolver: yupResolver(schemas[prefix]), defaultValues: schemas[prefix].getDefault() })

export function useCreator<TData = any>(prefix: string, enabled: boolean) {
  const form = useCreatorForm(prefix)
  const navigate = useNavigate()
  const path = usePath(prefix)
  const { mutateAsync } = useMutation<string, object, any[]>(['create', ...path])
  const { data, isSuccess } = useQuery<TData>(path, { enabled, onSuccess: form.reset })
  const create = (data: object) => mutateAsync([path, data])
    .then(() => navigate('/courses' + (path[1] ? `/${path[1]}/supervisor` : ''), { state: { refresh: !path[1] } }))
    .catch(() => form.reset('', { keepIsSubmitted: false }))
  return { form, create, data, isSuccess }
}

export const useCreate = (slug: string) => {
  const target = slug === '' ? "/create" : "/edit"
  const { mutate, isLoading } = useMutation<string, any, object>(repository =>
    axios.post(target, repository),
    { onSuccess: () => window.location.reload() }
  )
  return { mutate, isLoading }
}

export const usePull = () => {
  const path = usePath('')
  const { mutate, isLoading } = useMutation(() =>
    axios.post('/courses' + `/${path[1]}/pull`, {}),
    { onSuccess: () => window.location.reload() }
  )
  return { mutate, isLoading }
}

export const useCourse = (options: UseQueryOptions<CourseProps> = {}) => {
  const { courseSlug } = useParams()
  return useQuery<CourseProps>(['courses', courseSlug], { enabled: !!courseSlug, ...options })
}

export const useStudents = () => {
  const { courseSlug } = useParams()
  return useQuery<StudentProps[]>(['courses', courseSlug, 'students'], { enabled: !!courseSlug })
}

export const useStudentPoints = () => {
  const { courseSlug } = useParams()
  return useQuery<StudentProps[]>(['courses', courseSlug, 'studentPoints'], { enabled: !!courseSlug })
}


export const useImport = () => {
  const { courseSlug } = useParams()
  const { mutateAsync, isLoading } = useMutation<string, object, any[]>(['import', courseSlug])
  const onImport = (data: any) =>
    mutateAsync([['courses', courseSlug, 'import'], data]).then(() => window.location.reload())
  return { onImport, isLoading }
}

export const useAssignment = () => {
  const { courseSlug, assignmentSlug } = useParams()
  return useQuery<AssignmentProps>(['courses', courseSlug, 'assignments', assignmentSlug], { enabled: !!assignmentSlug })
}

export const useTask = (userId: string) => {
  const [timer, setTimer] = useState<number>()
  const { courseSlug, assignmentSlug, taskSlug } = useParams()
  const query = useQuery<TaskProps>(['courses', courseSlug, 'assignments', assignmentSlug, 'tasks', taskSlug, 'users', userId], { enabled: !timer })
  const { mutateAsync } = useMutation<any, any, any[]>(['submit', courseSlug, assignmentSlug, taskSlug], {
    onMutate: () => setTimer(Date.now() + 30000),
    onSettled: () => setTimer(undefined), onSuccess: query.refetch
  })
  const submit = (data: NewSubmissionProps) =>
    mutateAsync([['courses', courseSlug, 'assignments', assignmentSlug, 'tasks', taskSlug, 'submit'], data])
  return { ...query, submit, timer }
}

export const useChatbot = (userId: string) => {
  const { courseSlug, assignmentSlug, taskSlug } = useParams()
  const query = useQuery<MessageI[]>(['courses', courseSlug, 'assignments', assignmentSlug, 'tasks', taskSlug, 'users', userId, 'chat', 'history'])
  const { mutateAsync } = useMutation<any, any, any[]>(['submit', courseSlug, assignmentSlug, taskSlug])
  const submit = (data: PromptChatbotProps): Promise<ChatbotResponseI> => mutateAsync([['courses', courseSlug, 'assignments', assignmentSlug, 'tasks', taskSlug, 'users', userId, 'chat', 'prompt'], data])

  return { query, submit }
}

export const useStatus = (statusProps: StatusProps) => {
  const toURL = (...path: any[]) => join(compact(flattenDeep(path)), '/')
  const query = useQuery<CourseFilesUploadStatusI[]>({
    queryKey: ['courses', 'status'],
    queryFn: () => axios.get(toURL(['courses', 'status']), {
      params: statusProps,
      paramsSerializer: { indexes: null }
    }),
    enabled: !!statusProps
  })

  return { query }
}
