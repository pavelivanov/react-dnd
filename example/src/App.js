import React, { Component } from 'react'
import { DragLayer, DragElement } from 'react-dnd'


const section1 = [
  { title: '1', index: 10 },
  { title: '2', index: 11 },
  { title: '3', index: 12, disabled: true },
  { title: '4', index: 13, disabled: true },
  { title: '5', index: 14 },
  { title: '6', index: 15 },
  { title: '7', index: 16, disabled: true },
  { title: '8', index: 17 },
  { title: '9', index: 18 },
]

const section2 = [
  { products: [
    { title: '1', index: 10 },
    { title: '2', index: 11 },
    { title: '3', index: 12, disabled: true },
  ] },
  { products: [
    { title: '4', index: 13, disabled: true },
    { title: '5', index: 14 },
    { title: '6', index: 15 },
  ] },
  { products: [
    { title: '7', index: 16, disabled: true },
    { title: '8', index: 17 },
    { title: '9', index: 18 },
  ] },
  { products: [
    { title: '10', index: 19, disabled: true },
    { title: '11', index: 20, disabled: true },
    { title: '12', index: 21, disabled: true },
  ] },
  { products: [
    { title: '13', index: 22 },
    { title: '14', index: 23 },
    { title: '15', index: 24 },
  ] },
]


export default class App extends Component {

  handleDragEnd = (fromIndex, toIndex) => {
    console.log('Drag end:', fromIndex, toIndex)
  }

  render() {

    return (
      <div>
        <DragLayer onDragEnd={this.handleDragEnd}>
          <div className="items">
            {
              section1.map(({ title, index, disabled }) => (
                <DragElement key={index} data={{ disabled }}>
                  <div className="item">
                    <div className={`itemContent${disabled ? ' disabled' : ''}`}>{title}</div>
                  </div>
                </DragElement>
              ))
            }
          </div>
        </DragLayer>
        <DragLayer onDragEnd={this.handleDragEnd}>
          <div className="items">
            {
              section2.map(({ products }, index) => (
                <div className="productsItem" key={index}>
                  {
                    products.map(({ title, index, disabled }) => (
                      <DragElement key={index} data={{ disabled }}>
                        <div className="product">
                          <div className={`itemContent${disabled ? ' disabled' : ''}`}>{title}</div>
                        </div>
                      </DragElement>
                    ))
                  }
                </div>
              ))
            }
          </div>
        </DragLayer>
      </div>
    )
  }
}
