import { concat, head, keys, last, map, split, uniq, update } from 'lodash'
import React, { useState } from 'react'
import { ControlledTreeEnvironment, Tree, TreeItem, TreeItemIndex } from 'react-complex-tree'
import 'react-complex-tree/lib/style.css'
import { toggle } from 'radash'
import { HStack, Text } from '@chakra-ui/react'
import { NodeIcon } from './Icons'
import { detectType } from '../components/Util'

type RootNodeProps = { selected: string, onSelect: (file: TaskFileProps) => void, files: Array<TaskFileProps> }

const createNode = (n: string, f: TaskFileProps) =>
    ({ index: n, children: [], isFolder: n !== f.path, data: n === f.path ? f : { name: last(split(n, '/')) } })
const addChild = (node: TreeItem, child: string) =>
    child ? update(node, 'children', c => uniq(concat(c, child))) : node
const splitPath = (p: string) => concat(map([...p.matchAll(/\//g)], a => p.substring(0, a.index)), p)

export function FileTree({ files, selected, onSelect }: RootNodeProps) {
  const tree: Record<string, TreeItem> = {}
  files.forEach(f => splitPath(f.path).forEach((n, i, nodes) =>
      tree[n] = addChild(tree[n] || createNode(n, f), nodes[i + 1])))
  const [expandedItems, setExpandedItems] = useState<TreeItemIndex[]>(keys(tree))
  const onClick = (item: TreeItem) => setExpandedItems(items => toggle(items, item.index))

  return <ControlledTreeEnvironment
      items={tree} getItemTitle={item => item.data.name} renderDepthOffset={13}
      children={<Tree treeId='task' rootItem={head(split(files[0].path, '/')) || ''} />}
      viewState={{ ['task']: { focusedItem: selected, expandedItems, selectedItems: [selected] } }}
      onExpandItem={onClick} onCollapseItem={onClick} renderItemTitle={({ item, context }) =>
      <HStack boxSize='full' onClick={() => !item.isFolder && onSelect(item.data)} color='gray.600' pl={2}>
        <NodeIcon name={detectType(item.data.name) || `folder-${!!context.isExpanded}`} boxSize={4} />
        <Text fontFamily='file' fontSize='sm'>{item.data.name}</Text>
      </HStack>} />
}
