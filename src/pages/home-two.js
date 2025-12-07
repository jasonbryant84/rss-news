'use client';

import { useState, useEffect } from 'react';
import HeadMeta from "../components/elements/HeadMeta";
import FooterOne from "../components/footer/FooterOne";
import HeaderTwo from "../components/header/HeaderTwo";
import PostSectionFive from "../components/post/PostSectionFive";
import PostSectionSeven from "../components/post/PostSectionSeven";
import PostSectionSix from "../components/post/PostSectionSix";
import PostSectionThree from "../components/post/PostSectionThree";
import SliderOne from "../components/slider/SliderOne";
import { useRSSArticles } from "../hooks/useRSSArticles";

const HomeTwo = () => {
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
        <HeadMeta metaTitle="Home Two"/>
        <HeaderTwo />
        <div className="section-gap p-t-xs-15 p-t-sm-60" style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading articles...</p>
        </div>
        <FooterOne />
      </>
    );
  }

  return ( 
    <>
    <HeadMeta metaTitle="Home Two"/>
    <HeaderTwo />
    {allPosts.length > 0 ? (
      <>
        <SliderOne slidePost={allPosts} />
        <PostSectionThree postData={allPosts} />
        <PostSectionSeven postData={allPosts} />
        <PostSectionFive postData={allPosts} />
        <PostSectionSix postData={allPosts} />
      </>
    ) : (
      <div className="section-gap p-t-xs-15 p-t-sm-60" style={{ textAlign: 'center', padding: '40px' }}>
        <p>No articles available</p>
      </div>
    )}
    <FooterOne />
    </>
   );
}
 
export default HomeTwo;

