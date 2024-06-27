import { useEffect, useRef, useState } from 'react';
import img from './images/avatars/image-amyrobson.png'
import './App.css';

function App() {
  let input = useRef(null)
  const [data,setData] = useState([])
  const [myUser,setMyUser] = useState([])
  //set the arrays
  useEffect(()=>{
    fetch(`http://localhost:3001/comments`).then((e)=> e.json()).then((e)=>{
      setData(e)
    })
    fetch(`http://localhost:3001/currentUser`).then((e)=> e.json()).then((e)=>{
      setMyUser(e)
    })
  },[])
  const [num,setNum] = useState(0)
  function rep(e){
    setNum(e)
   
  }
  // add a comment
  async  function add(e){
    let value =  input.current.value
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: value,
          createdAt:`1 month ago`,
          replies:[],
          score:0,
          user:myUser
        })
    };
    input.current.value = ``
      fetch('http://localhost:3001/comments',requestOptions)
     await fetch(`http://localhost:3001/comments`).then((e)=> e.json()).then((e)=>{
        setData(e)
      })
      fetch(`http://localhost:3001/comments`).then((e)=> e.json()).then((e)=>{
        setData(e)
      })
     
    }
   
   async function get(e){
   
   return fetch(`http://localhost:3001/comments/${e}`).then((e)=> e.json()).then((e)=>{
     return e
    })
    
   }
  async function plus(id,type){
    const body = {
      content: 1,
      createdAt:`1 month ago`,
      replies:[],
      score:0,
      user:myUser
    }
   
  await  get(id).then((e)=>{
      body.content = e.content
      body.createdAt = e.createdAt
      body.replies = e.replies
      body.user = e.user
      if(type == `plus`){
        body.score = +e.score + 1
        
      }else{
        body.score = +e.score - 1
        
      }
    }) 
    
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:JSON.stringify(body) 
  };
  fetch(`http://localhost:3001/comments/${id}`,requestOptions)
 await fetch(`http://localhost:3001/comments`).then((e)=>e.json()).then((e)=>{
    setData(e)
  })
  fetch(`http://localhost:3001/comments`).then((e)=> e.json()).then((e)=>{
    setData(e)
  })
  
   }
 async  function makeReply(value,id){
    console.log(value)
    await  get(id).then((e)=>{
    const replies = e.replies
      replies.push({
        content: value,
        createdAt:`1 month ago`,
        score:0,
        user:myUser,
        replyingTo:e.user.username,
        id:Math.random()
      })
    const body = {
      content: e.content,
      createdAt:e.createdAt,
      replies:replies,
      score:e.score,
      user:e.user
    }
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:JSON.stringify(body)

  };
  fetch(`http://localhost:3001/comments/${id}`,requestOptions)
  })
  setNum(0)
 await fetch(`http://localhost:3001/comments/`).then((e)=> e.json()).then((e)=>{
    setData(e)
  })
  fetch(`http://localhost:3001/comments`).then((e)=> e.json()).then((e)=>{
    setData(e)
  })
  
   }
 async  function deleteComment(e){
    fetch(`http://localhost:3001/comments/${e}`,{ method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },})
    await  fetch(`http://localhost:3001/comments`).then((e)=> e.json()).then((e)=>{
        setData(e)
      })
      fetch(`http://localhost:3001/comments`).then((e)=> e.json()).then((e)=>{
        setData(e)
      })
   }
   async function deleteReply(id,x){
    
     let index;
    let arr;
   await fetch(`http://localhost:3001/comments/${id}`).then((e)=> e.json()).then((e)=>{
    arr = e.replies
      arr.forEach((rep)=>{
        if(x.dataset.id == rep.id){
          index = arr.indexOf(rep)
          
        }
      })
    })
  await  arr.splice(index,1)
 await get(id).then((e)=>{

    const body = {
      content: e.content,
      createdAt:e.createdAt,
      replies:arr,
      score:e.score,
      user:e.user,
    }
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:JSON.stringify(body)
  
  };
  fetch(`http://localhost:3001/comments/${id}`,requestOptions)
  })
  fetch(`http://localhost:3001/comments`).then((e)=> e.json()).then((e)=>{
    setData(e)
  })
  
   }
  return (
    <div className="App">
      <div className=' container  m-auto  p-4'>
        <div className=' w-1/2 mx-auto' >
              <input ref={input} type='text' placeholder='Write a comment' className=' h-12 w-2/3 outline-none' />
              <button onClick={(e)=>{add(e.currentTarget)}} id='btn' className=' text-white uppercase p-2 m-2 rounded w '>Add comment</button>
        </div>
      {/* // main comments */}
         { data.map((e,index)=>{
          return <div key={index}><div  className=' bg-white  m-12 p-4 w-1/2 mx-auto min-h-24  rounded flex shadow-xl'>
          <div className=' w-1/12 h-21    flex flex-col justify-between items-center h-1/2 my-auto rounded'>
            <p data-type='plus' onClick={(r)=>{plus(e.id,r.currentTarget.dataset.type)}}  className=' cursor-pointer'>+</p>
            <p>{e.score}</p>
            <p data-type='minus' onClick={(r)=>{plus(e.id,r.currentTarget.dataset.type)}} className=' cursor-pointer'>-</p>
          </div>
          <div className=' w-11/12 h-21  rounded grid grid-rows-3' >
              <div className=' flex  justify-between ' >
                <div className=' w-1/2  flex justify-evenly'>
                  <img src={e.user.image.png} />
                  <h4>{e.user.username}</h4>
                  {e.user.username == myUser.username && <p>you</p>}
                  <p>{e.createdAt}</p>
                </div>
                {e.user.username == myUser.username && <p onClick={()=>{deleteComment(e.id)}} className=' cursor-pointer'>Delete</p>}
              <div className=' w-1/6 -500 cursor-pointer' id={e.id} onClick={(r)=>{rep(e.id)}} >
                  <p>reply</p>
              </div>
              </div>
              <div className=' row-span-2 p-2' >
                    <p>{e.content}</p>
              </div>
          </div>
      </div>
      {/* //replies */}
      {e.replies.length > 0 && e.replies.map((r)=>{
        return <div data-id={r.id} key={2222 + r.id} className=' text-sm bg-white m-6 p-2 w-2/5 mx-auto min-h-24  rounded flex shadow-xl'>
        <div className=' w-1/12 h-21    flex flex-col justify-between items-center h-1/2 my-auto rounded'>
          <p className=' cursor-pointer'>+</p>
          <p>{r.score}</p>
          <p className=' cursor-pointer'>-</p>
        </div>
        <div className=' w-11/12 h-21  rounded grid grid-rows-3' >
            <div className=' flex  justify-between ' >
              <div className=' w-1/2  flex justify-evenly'>
                <img src={r.user.image.png} />
                <h4>{r.user.username}</h4>
                {r.user.username == myUser.username && <p>you</p>}
                <p>{r.createdAt}</p>
              </div>
              {r.user.username == myUser.username && <p className=' cursor-pointer ' onClick={(x)=>{deleteReply(e.id,x.currentTarget.parentElement.parentElement.parentElement)}}>Delete</p>} 
            
            </div>
            <div className=' row-span-2 p-2' >
                  <p>{r.content}</p>
            </div>
        </div>
    </div>
      })}
      {/* //make a reply */}
      {num == e.id && <div   className=' p-8 w-1/2 h-12 mx-auto flex justify-between items-center rounded shadow'>

          <img src={e.user.image.png} />
            <input  type='text' className=' w-3/4 h-12' />
            <button id='btn' className=' text-white uppercase p-2 m-2 rounded bg-fuchsia-700' onClick={(x)=>{makeReply(x.currentTarget.previousElementSibling.value,e.id)}}>reply</button>
        </div>}
      </div>})} 
        
      </div>
    </div>
  );
}

export default App;
