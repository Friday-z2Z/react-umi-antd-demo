/**
 * title: pageB
 */
import React, { useState, useEffect, useRef } from 'react'
import { Button, Message } from 'antd'

export default function PageB(props){

    let timerNode = useRef()

    const [count,setCount] = useState(0)
    // hook render后即调用 等价与componentDidMount、componentDidUpdate ...  通过返回一个函数来取消
    useEffect(
        ()=>{
            Message.info(`you clicked ${count} times`)
        }
    )

    // let [timer] = useState(null)
    useEffect(
        ()=>{
            const timer = setTimeout(() => {
                Message.info('I am coming!')
            }, 1000);
            timerNode.current = timer

            //  通过返回函数来清除timer
            return ()=>{
                if(timerNode.current){
                    clearTimeout(timerNode)
                    Message.info('I am leaving!')
                }
            }
        }
    )

    return (
        <Button onClick={() => setCount(count+1)}>click add count</Button>
    )
}