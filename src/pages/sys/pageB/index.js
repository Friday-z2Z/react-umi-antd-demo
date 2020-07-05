/**
 * title: pageB
 */
import React, { useState, useEffect } from 'react'
import { Button, Message } from 'antd'

export default function PageB(props){

    const [count,setCount] = useState(0)
    // hook render后即调用 等价与componentDidMOunt、componentDidUpdate ...  通过返回一个函数来取消
    useEffect(
        ()=>{
            Message.info(`you clicked ${count} times`)
        }
    )

    let [timer] = useState(null)
    useEffect(
        ()=>{
            timer = setTimeout(() => {
                Message.info('I am coming!')
            }, 1000);

            //  通过返回函数来清除timer
            return ()=>{
                clearTimeout(timer)
                Message.info('I am leaving!')
            }
        }
    )

    return (
        <Button onClick={() => setCount(count+1)}>click add count</Button>
    )
}