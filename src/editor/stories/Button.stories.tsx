import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Button } from '../components/form/button'

export default {
  title: 'Atoms/Buttons',
  component: Button
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = ( args ) => (
  <Button {...args} />
)

export const Primary = Template.bind( {} )
Primary.args = {
  disabled: false,
  children: 'Primary',
  onClick: console.log
}

export const Secondary = Template.bind( {} )
Secondary.args = {
  disabled: false,
  children: 'Secondary',
  onClick: console.log
}