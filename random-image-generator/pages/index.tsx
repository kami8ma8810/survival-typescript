import { useEffect, useState } from 'react';
import type { NextPage, GetServerSideProps } from 'next';

interface CatCategory {
  id: number;
  name: string;
}

interface SearchCatImage {
  breeds: string[];
  categories: CatCategory[];
  id: string;
  url: string;
  width: number;
  height: number;
}
type SearchCatImageResponse = SearchCatImage[];

// APIからランダムな画像を取得。戻り値がanyなので、型定義する。
const fetchCatImage = async (): Promise<SearchCatImage> => {
  const res = await fetch('https://api.thecatapi.com/v1/images/search');
  const result = (await res.json()) as SearchCatImageResponse;
  return result[0];
};

// 初期画像用のインターフェース
interface IndexPageProps {
  initialCatImageUrl: string;
}

const IndexPage: NextPage<IndexPageProps> = ({ initialCatImageUrl }) => {
  const [catImageUrl, setCatImageUrl] = useState(initialCatImageUrl);

  const handleClick = async () => {
    const image = await fetchCatImage();
    setCatImageUrl(image.url);
  };
  return (
    <>
      <h1 style={{ fontSize: 40 }}>Random Cat Image Generator</h1>
      <button onClick={handleClick} style={{ fontSize: 32, cursor: 'pointer', backgroundColor: 'white' }}>
        Switch Image
      </button>
      <div style={{ marginTop: 40 }}>
        <img src={catImageUrl} width={500} height={500} style={{ objectFit: 'cover' }} />
      </div>
    </>
  );
};

// getServerSidePropsで猫画像を取得して、IndexPageにpropsとして渡すことでページ表示時の初期画像を出力する
export const getServerSideProps: GetServerSideProps<IndexPageProps> = async () => {
  const catImage = await fetchCatImage();
  return {
    props: {
      initialCatImageUrl: catImage.url,
    },
  };
};

export default IndexPage;
