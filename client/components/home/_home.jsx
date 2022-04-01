import { useContext, useEffect, useState } from 'react';
import { ApiContext } from '../../utils/api_context';
import { Button } from '../common/button';
import { Input } from '../common/input'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';


export const Home = () => {
  const api = useContext(ApiContext);
  const navigate = useNavigate();

  const [chatRooms, setChatRooms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');


  useEffect(async () => {
    const res = await api.get('/users/me');
    const { chatRooms } = await api.get('/chat_rooms');
    console.log(chatRooms);
    setChatRooms(chatRooms);
    setUser(res.user);
    setLoading(false);
    
  useEffect(()=>{
    const watch = navigator.geolocation.watchPosition((location)=>{
      setLat(location.coords.latitude);
      setLong(location.coords.longitude); 
    },
    (err) => {
      setErrorMessage(err.message);
    });

    return ()=> {navigator.geolocation.clearWatch(watch);};
  },[]);

  if (loading) {
    return <div>Loading...</div>;
  }
  
  


  const createRoom = async () => {
    if (name == ''){return}
    const body = {
      name: name,
      lat: lat,
      long: long,
    }
    const { chatRoom } = await api.post('/chat_rooms', body);
    setChatRooms([...chatRooms, chatRoom]);
    setName('');
    navigate(`/chat_rooms/${chatRoom.id}`)

  };


  function roomInRange(room){
    let distance = calcCrow(lat,long,room.lat,room.long);
    if (distance < 10){ return true;}
    else return false;
  }
  // Taken from stackoverflow https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates 
  // Using the implementation done by Derek
  //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
  function calcCrow(lat1, lon1, lat2, lon2) 
  {
    var R = 6371; // km
    var dLat = toRad(lat2-lat1);
    var dLon = toRad(lon2-lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
  }

  // Converts numeric degrees to radians
  function toRad(Value) 
  {
      return Value * Math.PI / 180;
  }
  const logout = async () => {
    const res = await api.del('/sessions');
    if (res.success) {
      setAuthToken(null);
    }
  };



  let inRange = chatRooms.map((chatRoom) =>{
    if (roomInRange(chatRoom)){
      return (
      <div className="m-4" key={chatRoom.id}>
        <Link to={`/chat_rooms/${chatRoom.id}`} className="border-2 rounded-lg p-1 bg-indigo-600 px-1 text-black">{chatRoom.name}</Link>
      </div>
      )
    }
  });
  return (
    <div className="p-4">
      <h1>Welcome {user.firstName}</h1>
      <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <Button onClick={createRoom}>Create Room</Button>
      <div>
        {inRange}
      </div>
      <Button type="button" onClick={logout}>
        Logout
      </Button>
    </div>
  );
};
