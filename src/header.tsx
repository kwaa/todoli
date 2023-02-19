import {
  createStyles,
  Header,
  Container,
  TextInput,
  Title,
  ActionIcon,
} from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { useClickOutside, useDisclosure } from '@mantine/hooks'

const useStyles = createStyles(() => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
}))

export const ToDoLiHeader = ({
  title,
  setTitle,
  resetLocalStorage,
}: {
  title: string
  setTitle: (val: string | ((prevState: string) => string)) => void
  resetLocalStorage: () => void
}) => {
  const { classes } = useStyles()
  const [opened, handlers] = useDisclosure(false)
  const ref = useClickOutside(() => handlers.close())
  return (
    <Header height={64} mb={16}>
      <Container className={classes.header}>
        {opened ? (
          <TextInput
            ref={ref}
            placeholder='ToDoLi'
            aria-label='Title Input'
            defaultValue={title}
            onChange={({ target }) =>
              target.value.length > 0 && setTitle(target.value)
            }
            onKeyPress={({ key }) => key === 'Enter' && handlers.close()}
          />
        ) : (
          <Title order={2} onDoubleClick={() => handlers.open()}>
            {title}
          </Title>
        )}
        <ActionIcon
          onClick={() => resetLocalStorage()}
          aria-label='reset localStorage'
          variant='light'
          radius='xl'
          size='xl'
        >
          <IconTrash />
        </ActionIcon>
      </Container>
    </Header>
  )
}
