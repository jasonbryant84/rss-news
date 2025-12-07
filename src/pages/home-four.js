'use client';

import { useState, useEffect } from 'react';
import HeadMeta from "../components/elements/HeadMeta";
import FooterTwo from "../components/footer/FooterTwo";
import HeaderFour from "../components/header/HeaderFour";
import PostSectionSix from "../components/post/PostSectionEight";
import SliderThree from "../components/slider/SliderThree";
import { useRSSArticles } from "../hooks/useRSSArticles";

const HomeFour = () => {
  const { articles, loading } = useRSSArticles();
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    if (articles && articles.length > 0) {
      setAllPosts(articles);
    }
  }, [articles]);

  if (loading) {
    return (
      <>
        <HeadMeta metaTitle="Home Four"/>
        <HeaderFour />
        <div className="section-gap p-t-xs-15 p-t-sm-60" style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading articles...</p>
        </div>
        <FooterTwo />
      </>
    );
  }

  return ( 
    <>
    <HeadMeta metaTitle="Home Four"/>
    <HeaderFour />
    {allPosts.length > 0 ? (
      <>
        <SliderThree postData={allPosts} />
        <PostSectionSix postData={allPosts} />
      </>
    ) : (
      <div className="section-gap p-t-xs-15 p-t-sm-60" style={{ textAlign: 'center', padding: '40px' }}>
        <p>No articles available</p>
      </div>
    )}
    <FooterTwo />
    </>
   );
}
 
export default HomeFour;

