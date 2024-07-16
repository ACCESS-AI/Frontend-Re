import { Box, Highlight, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { isNull, round } from 'lodash'
import React from 'react'
import {
  Area, AreaChart, Bar, BarChart, Cell, Label, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts'
import { formatPoints } from '../components/Util'

const green = '#46dba4'
const purple = '#9576ff'
const hover = { fontSize: '80%', fontWeight: 500, padding: '5px', background: 'rgba(255,255,255,0.74)', border: 'none' }
type TimeCounterProps = { values: Array<TimerProps> }

const toPercent = (value = 0, max = 1) => round(((value || 0) * 100.0) / (max || 1), 1)

const RoundBar = ({ x, y, height, width, background, color }: any) =>
    <g clipPath='inset(0 round 6)'>
      <rect x={x} y={y} height={background.height} width={background.width} opacity={0.05} />
      <rect x={x} y={y} height={height} width={width} color={color} fill='currentColor' />
    </g>

const TimeCount = ({ current, max, name }: TimerProps) =>
    <ResponsiveContainer>
      <PieChart height={120} width={100}>
        <Pie data={[{ current }, { current: max - current }]} dataKey='current' innerRadius='80%' outerRadius='100%'
             startAngle={90} endAngle={-270} cy='35%'>
          <Cell key='cell-0' color={green} fill='currentColor' />
          <Cell key='cell-1' opacity={0.15} />
          <Label value={current} color={green} fill='currentColor' fontWeight={600} position='center' />
          <Label value={name} opacity={0.7} fontSize='75%' position='bottom' dy={12} />
        </Pie>
      </PieChart>
    </ResponsiveContainer>

export const TimeCountDown = ({ values }: TimeCounterProps) =>
    <SimpleGrid h={16} w={40} columns={3}>
      {values.map(counter =>
          <TimeCount key={counter.name} current={counter.current} max={counter.max} name={counter.name} />)}
    </SimpleGrid>

export const ScorePie = ({ value = 0, max = 1 }) =>
    <ResponsiveContainer>
      <PieChart>
        <Pie dataKey='value' innerRadius='75%' outerRadius='100%' startAngle={90} endAngle={-270}
             data={[{ value }, { value: (max || 1) - value }]}>
          <Cell key='cell-0' color={green} fill='currentColor' />
          <Cell key='cell-1' opacity={0.15} />
          <Label value={`${formatPoints(value)} / ${formatPoints(max)}`} color='inherit' fill='currentColor' dy={-5} position='center' />
          <Label value={`${toPercent(value, max)}%`} color={green} fill='currentColor'
                 fontSize='80%' position='centerTop' dy={10} />
        </Pie>
      </PieChart>
    </ResponsiveContainer>

export const ScoresPie = ({ value = 0, max = 1, avg = 0 }) =>
    <ResponsiveContainer>
      <PieChart>
        <Pie dataKey='value' innerRadius='75%' outerRadius='100%' startAngle={90} endAngle={-270}
             data={[{ value }, { value: max - value }]}>
          <Cell key='cell-0' color={green} fill='currentColor' />
          <Cell key='cell-1' opacity={0.15} />
          <Label value={`${value} / ${max}`} color='inherit' fill='currentColor' position='center' />
        </Pie>
        <Pie dataKey='avg' innerRadius='60%' outerRadius='70%' startAngle={90} endAngle={-270}
             data={[{ avg }, { avg: max - avg }]}>
          <Cell key='cell-0' color={purple} fill='currentColor' />
          <Cell key='cell-1' opacity={0.15} />
        </Pie>
        <Tooltip cursor={false} itemStyle={{ padding: 0 }} content={() =>
            <Box fontSize='xs' fontWeight={500} bg='base' p={1} rounded='lg' opacity={0.9}>
              <Text>
                <Highlight query={'Me'} styles={{ color: 'green.600' }}>
                  {`Me: ${value} / ${max}`}
                </Highlight>
              </Text>
              <Text>
                <Highlight query={'Avg.'} styles={{ color: 'purple.600' }}>
                  {`Avg.: ${avg} / ${max}`}
                </Highlight>
              </Text>
            </Box>} />
      </PieChart>
    </ResponsiveContainer>

export const HScores = ({ value = 0, max = 1, avg = 0 }) =>
    <ResponsiveContainer minHeight={50}>
      <BarChart data={[{ value, name: 'Score' }]} barSize={10} layout='vertical'>
        <XAxis hide type='number' dataKey='value' domain={[0, max || 1]} />
        <YAxis axisLine={false} tickLine={false} interval={0} fontSize='small' type='category' dataKey='name' />
        <Bar dataKey='value' minPointSize={5} shape={RoundBar}>
          <Cell key='cell-0' color={green} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>

export const ScoreBar = ({ value = 0, max = 1, h = 10 }) =>
    <Stack align='end' justify='end' spacing={0}>
      <Text textAlign='end' px={2} fontSize='sm'>{`Score ${isNull(value) ? '?' : formatPoints(value)} / ${formatPoints(max)}`}</Text>
      <ResponsiveContainer height={h + 2}>
        <BarChart data={[{ value, name: 'Score' }]} margin={{}} barSize={h} layout='vertical'>
          <XAxis hide type='number' dataKey='value' domain={[0, max || 1]} />
          <YAxis hide type='category' dataKey='name' />
          <Bar dataKey='value' color={green} shape={RoundBar} />
        </BarChart>
      </ResponsiveContainer>
    </Stack>

