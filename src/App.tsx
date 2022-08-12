import { useEffect } from 'react'
import { MantineProvider } from '@mantine/core'
import { useLocalStorage, useColorScheme } from '@mantine/hooks'
import { ToDoLiHeader } from './header'
import { ToDoList } from './list'

export default () => {
  const colorScheme = useColorScheme()

  const [encodeBase64Url, decodeBase64Url] = [
    (str: string) =>
      btoa(str).replace(
        /[+/=]/g,
        (m) => ({ '+': '-', '/': '_', '=': '.' }[m]!)
      ),
    (str: string) =>
      atob(str.replace(/[-_.]/g, (m) => ({ '-': '+', _: '/', '.': '=' }[m]!))),
  ]

  const [title, setTitle] = useLocalStorage<string>({
    key: 'title',
    defaultValue: 'ToDoLi',
  })

  const [todo, setToDo] = useLocalStorage<ToDo[]>({
    key: 'todo',
    defaultValue: [
      {
        text: 'Hello World',
        checked: false,
      },
    ],
  })

  const resetLocalStorage = () => {
    setTitle('ToDoLi')
    setToDo([])
  }

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('title', title)
    window.history.pushState(null, '', url.toString())
    document.title = title
  }, [title])

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('todo', encodeBase64Url(JSON.stringify(todo)))
    window.history.pushState(null, '', url.toString())
  }, [todo])

  useEffect(() => {
    const url = new URL(window.location.href)
    if (url.searchParams.has('title')) setTitle(url.searchParams.get('title')!)
    if (url.searchParams.has('todo'))
      setToDo(JSON.parse(decodeBase64Url(url.searchParams.get('todo')!)))
  }, [])

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme,
        primaryColor: colorScheme === 'dark' ? 'gray' : 'dark',
      }}
    >
      <ToDoLiHeader
        title={title}
        setTitle={setTitle}
        resetLocalStorage={resetLocalStorage}
      />
      <ToDoList todo={todo} setToDo={setToDo} />
    </MantineProvider>
  )
}
