'use client';

import { useState, useEffect } from 'react';
import HeadMeta from "../components/elements/HeadMeta";
import FooterOne from "../components/footer/FooterOne";
import HeaderOne from "../components/header/HeaderOne";
import PostSectionFive from "../components/post/PostSectionFive";
import PostSectionFour from "../components/post/PostSectionFour";
import PostSectionOne from "../components/post/PostSectionOne";
import PostSectionSix from "../components/post/PostSectionSix";
import PostSectionThree from "../components/post/PostSectionThree";
import PostSectionTwo from "../components/post/PostSectionTwo";
import { useRSSArticles } from "../hooks/useRSSArticles";

const HomeOne = () => {
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
        <HeadMeta metaTitle="Home One" />
        <HeaderOne />
        <div className="section-gap p-t-xs-15 p-t-sm-60" style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading articles...</p>
        </div>
        <FooterOne />
      </>
    );
  }

  return ( 
    <>
    <HeadMeta metaTitle="Home One"/>
    <HeaderOne />
    {allPosts.length > 0 ? (
      <>
        <PostSectionOne postData={allPosts} />
        <PostSectionTwo postData={allPosts} />
        <PostSectionThree postData={allPosts} />
        <PostSectionFour postData={allPosts} />
        <PostSectionFive postData={allPosts} adBanner={true} />
        <PostSectionSix postData={allPosts}/>
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
 
export default HomeOne;

