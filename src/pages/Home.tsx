import Navbar from '@/components/Atoms/NavBar'
import Dictaphone from '@/components/Organisms/Dictaphone'

const Home = () => {
  return (
    <div>
      <Navbar />

      <div className='w-10/12 mt-10 mx-auto'>
        <Dictaphone />
      </div>
    </div>
  )
}

export default Home
