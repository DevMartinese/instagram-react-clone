import React, { useState, useEffect } from 'react';
import Post from './components/Post';
import ImageUpload from './components/ImageUpload';
import { db, auth } from './backend/firebase';
import { Modal, makeStyles, Button, Input } from '@material-ui/core';
import InstagramEmbed from 'react-instagram-embed';
import './App.css';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSingIn, setOpenSingIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser){
        console.log(authUser);
        setUser(authUser);
      }
      else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    }

  }, [user, username]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
       setPosts(snapshot.docs.map(doc => ({id: doc.id, post: doc.data()})))
    })
  }, []);

  const singUp = e => {
     e.preventDefault();
     
     auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
         return authUser.user.updateProfile({
           displayName: username
         })
      })
        .catch((error) => alert(error.message))

     setOpen(false);  
  }

  const singIn = e => {
     e.preventDefault();

     auth.signInWithEmailAndPassword(email, password)
        .catch((error) => alert(error.message))

    setOpenSingIn(false);    
  }

  return (
    <div className="App">
       <Modal open={open} onClose={() => setOpen(false)}>
            <div style={modalStyle} className={classes.paper}>
               <form className="app__singUp">
                  <center>
                     <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="Instagram" />
                  </center>

                  <Input placeholder="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

                  <Input placeholder="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />

                  <Input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                  <Button type="submit" onClick={singUp}>Sing Up</Button>
               </form>               
            </div>
       </Modal>

       <Modal open={openSingIn} onClose={() => setOpenSingIn(false)}>
            <div style={modalStyle} className={classes.paper}>
               <form className="app__singUp">
                  <center>
                     <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="Instagram" />
                  </center>

                  <Input placeholder="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />

                  <Input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                  <Button type="submit" onClick={singIn}>Sing In</Button>
               </form>               
            </div>
       </Modal>

       <div className="app__header">
          <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="Instagram" />
       
          {
            user ? 
                (
                  <Button onClick={() => auth.signOut()}>Log Out</Button>
                )
                :
                (
                  <div className="app__loginContainer">
                    <Button onClick={() => setOpenSingIn(true)}>Sing In</Button>
                    <Button onClick={() => setOpen(true)}>Sing Up</Button>
                  </div> 
                )
          }
       </div>
       
       <div className="app__posts">
         <div className="app__postsLeft">
            {
                posts.map(({id, post}) => (
                <Post key={id} user={user} postId={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
                ))
            }
         </div>
         <div className="app__postsRight">
            <InstagramEmbed
                url='https://www.instagram.com/p/BcnvdjbBILv/'
                maxWidth={320}
                hideCaption={false}
                containerTagName='div'
                protocol=''
                injectScript
                onLoading={() => {}}
                onSuccess={() => {}}
                onAfterRender={() => {}}
                onFailure={() => {}}
            />
          </div>
       </div>

       {
         user?.displayName ?
            (<ImageUpload username={user.displayName} />)
            :
            (<h3>Tenes que estar logueado para subir una imagen</h3>)
       }
    </div>
  );
}

export default App;