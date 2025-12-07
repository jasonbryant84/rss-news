'use client';

import { useState, useEffect } from 'react';
import CategoryOne from "../components/category/CategoryOne";
import HeadMeta from "../components/elements/HeadMeta";
import FooterOne from "../components/footer/FooterOne";
import HeaderThree from "../components/header/HeaderThree";
import PostSectionFive from "../components/post/PostSectionFive";
import SliderTwo from "../components/slider/SliderTwo";
import { useRSSArticles } from "../hooks/useRSSArticles";

const HomeThree = () => {
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
        <HeadMeta metaTitle="Home Three"/>
        <HeaderThree />
        <div className="section-gap p-t-xs-15 p-t-sm-60" style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading articles...</p>
        </div>
        <FooterOne />
      </>
    );
  }

  return ( 
    <>
    <HeadMeta metaTitle="Home Three"/>
    <HeaderThree />
    {allPosts.length > 0 ? (
      <>
        <SliderTwo slidePost={allPosts} />
        <CategoryOne cateData={allPosts} />
        <PostSectionFive postData={allPosts} pClass="section-gap bg-grey-light-three" />
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
 
export default HomeThree;

