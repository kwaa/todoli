import type { ChangeEvent } from 'react'
import type { MantineTheme } from '@mantine/core'
import { useEffect } from 'react'
import {
  createStyles,
  Container,
  Group,
  Checkbox,
  TextInput,
  Text,
  ActionIcon,
} from '@mantine/core'
import { useListState, useDisclosure, useClickOutside } from '@mantine/hooks'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { IconGripVertical, IconX, IconPlus } from '@tabler/icons-react'

const useStyles = createStyles((theme: MantineTheme) => ({
  item: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: theme.radius.md,
    border: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    padding: `${theme.spacing.sm}px ${theme.spacing.xl}px`,
    paddingLeft: theme.spacing.xl - theme.spacing.md, // to offset drag handle
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,
    marginBottom: theme.spacing.sm,
  },

  itemDragging: {
    boxShadow: theme.shadows.sm,
  },

  dragHandle: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[1]
        : theme.colors.gray[6],
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },

  close: {
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[1]
        : theme.colors.gray[6],
  },
}))

export const ToDoList = ({
  todo,
  setToDo,
}: {
  todo: ToDo[]
  setToDo: (val: ToDo[] | ((prevState: ToDo[]) => ToDo[])) => void
}) => {
  const { classes, cx } = useStyles()
  const [list, handlers] = useListState(todo)

  useEffect(() => setToDo(list), [list])

  useEffect(() => {
    if (todo !== list) {
      handlers.remove(...Array(list.length).keys())
      handlers.append(...todo)
    }
  }, [todo])

  const items = list.map(({ text, checked }, index) => (
    <Draggable key={index} index={index} draggableId={index.toString()}>
      {(provided, snapshot) => {
        const [edit, editHandlers] = useDisclosure(false)
        const ref = useClickOutside(() => editHandlers.close())

        return (
          <Group
            className={cx(classes.item, {
              [classes.itemDragging]: snapshot.isDragging,
            })}
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            <div {...provided.dragHandleProps} className={classes.dragHandle}>
              <IconGripVertical size={18} stroke={1.5} />
            </div>
            <Checkbox
              checked={checked}
              onChange={({ currentTarget }: ChangeEvent<HTMLInputElement>) =>
                handlers.setItemProp(index, 'checked', currentTarget.checked)
              }
            />
            {edit ? (
              <TextInput
                ref={ref}
                style={{ flex: 1 }}
                defaultValue={text}
                onChange={({ target }) =>
                  target.value.length > 0 &&
                  handlers.setItemProp(index, 'text', target.value)
                }
                onKeyPress={({ key }) =>
                  key === 'Enter' && editHandlers.close()
                }
              />
            ) : (
              <Text
                style={{
                  flex: 1,
                  textDecoration: checked ? 'line-through' : 'none',
                }}
                color={checked ? 'dimmed' : ''}
                onDoubleClick={() => editHandlers.open()}
              >
                {text}
              </Text>
            )}
            <ActionIcon>
              <IconX
                className={cx(classes.close)}
                onClick={() => handlers.remove(index)}
              />
            </ActionIcon>
          </Group>
        )
      }}
    </Draggable>
  ))

  return (
    <Container>
      <DragDropContext
        onDragEnd={({ destination, source }) =>
          handlers.reorder({ from: source.index, to: destination?.index || 0 })
        }
      >
        <Droppable droppableId='todo-list' direction='vertical'>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {items}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <ActionIcon
        onClick={() => handlers.append({ text: 'ToDo', checked: false })}
        style={{
          width: '100%',
        }}
        variant='light'
        size='xl'
      >
        <IconPlus />
      </ActionIcon>
    </Container>
  )
}
