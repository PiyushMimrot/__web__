
import React from 'react';
import { motion } from 'framer-motion';

const BackDrop = (props:{show:boolean,children:React.ReactNode}) => {
    return (
      props.show?
    <motion.div
      initial={{ opacity: 0 }} // Set initial opacity to 0 (invisible)
      animate={{ opacity: 1 }} // Animate opacity to 1 (fully visible)
      transition={{ duration: 0.3 }} // Set animation duration to 1 second
      style={{
        position:'absolute',
        top:0,
        left:0,
        width:'100vw',
        height:'100vh',
        zIndex:1070,
        backgroundColor:'rgba(0,0,0,0.6)',
      }}>
      {props.children}
    </motion.div>:<></>)
  }


export {BackDrop}