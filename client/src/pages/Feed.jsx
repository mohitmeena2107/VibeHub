import React, { useEffect, useState } from 'react'
import { Loading } from '../components/Loading';
import StoryBar from '../components/StoryBar';
import {dummyUserData} from '../assets/assets' 


const Feed = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    setFeeds(dummyUserData);
    setLoading(false);
  }

  useEffect(() => {
    fetchFeed();
  },[])

  return !loading ? (
    <div className='h-full overflow-y-scroll no-scrollbar xl:pr-5 py-10 flex items-start justify-center xl:gap-8'>
      {/* Stories and post list */}
      <div>
        <StoryBar/>
        <div className='p-4 space-y-6'>List of post</div>
      </div>
      {/* Right Side */}
      <div>
        <div>
          <h1>Sponsored</h1>
        </div>
        <h1>Recent messages</h1>
      </div>
    </div>
  ) : <Loading />
}

export default Feed