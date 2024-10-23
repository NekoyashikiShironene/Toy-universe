import connectToDatabase from "@/utils/db";
import ImageSlider from "@/components/ImageSlider";
import Search from "@/components/SearchBar";
import { ScreenContainer } from "@/components/Containers";
import "../styles/home.css";

type Member = {
  cus_id: number,
  username: string,
  password: string,
  name: string,
  tel: string,
  address: string,
  gender: number
}

const testDatabaseConnection = async () => {
  try {
    const connection = await connectToDatabase();
    const [results, fields] = await connection.query("SELECT * FROM `customer`");
    await connection.end();
    
    return results;


  } catch (error) {
    console.error('Database connection failed:', error);
  }
};



export default async function Home() {

  return (
    <ScreenContainer>
      <Search type="mobile" />
      <ImageSlider/>
    </ScreenContainer>
  );
}
