import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ApiContext } from '../../utils/api_context';
import { Input } from '../common/input';
import { Button } from '../common/button';
import { useMessages } from '../../utils/use_messages';
import { Message } from './message';

export const ChatRoom = () => {
  const [chatRoom, setChatRoom] = useState(null);
  const [contents, setContents] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const api = useContext(ApiContext);
  const { id } = useParams();
  const [messages, sendMessage] = useMessages(chatRoom);
  useEffect(async () => {
    setLoading(true);
    if (!user) {
      const { user } = await api.get('/users/me');
      setUser(user);
    }
    const { chatRoom } = await api.get(`/chat_rooms/${id}`);
    setChatRoom(chatRoom);
    setLoading(false);
  }, [id]);

  if (loading) return 'Loading...';
  console.log(user)
  return (
    <div className="chat-container">
      <div>
        {messages.map((message) => {
          if (message.userName == (`${user.firstName} ${user.lastName}`)){
            return (
              <div className="border-2 rounded-lg p-1 bg-green-300 flex-wrap" key={message.id}>
              <h3>{message.userName}</h3>
              {message.contents}
              </div>
            );
          }
          return (
            <div className="border-2 rounded-lg p-1 bg-blue-500 flex-wrap" key={message.id}>
            <h3>{message.userName}</h3>
            {message.contents}
            </div>
          )
          

        })}
      </div>
      <div>
        <Input type="text" value={contents} onChange={(e) => setContents(e.target.value)} />
        <Button onClick={() => sendMessage(contents, user)}>Send</Button>
      </div>
    </div>
  );
};
