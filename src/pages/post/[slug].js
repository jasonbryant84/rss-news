import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Breadcrumb from "../../components/common/Breadcrumb";
import HeadMeta from "../../components/elements/HeadMeta";
import FooterOne from "../../components/footer/FooterOne";
import HeaderOne from "../../components/header/HeaderOne";
import PostFormatStandard from "../../components/post/post-format/PostFormatStandard";
import PostSectionSix from "../../components/post/PostSectionSix";
import { useRSSArticles } from "../../hooks/useRSSArticles";


const PostDetails = () => {
	const router = useRouter();
	const { slug } = router.query;
	const { articles, loading } = useRSSArticles();
	const [postContent, setPostContent] = useState(null);
	const [allPosts, setAllPosts] = useState([]);

	useEffect(() => {
		if (!loading && articles.length > 0) {
			setAllPosts(articles);
			
			// Find the post by slug
			const foundPost = articles.find(article => article.slug === slug);
			if (foundPost) {
				setPostContent(foundPost);
			} else if (slug) {
				// If not found by slug, redirect to original URL
				if (foundPost?.link) {
					window.location.href = foundPost.link;
				}
			}
		}
	}, [articles, loading, slug]);

	if (loading || !postContent) {
		return (
			<>
				<HeadMeta metaTitle="Loading..." />
				<HeaderOne />
				<div className="section-gap" style={{ textAlign: 'center', padding: '60px 0' }}>
					<p>Loading article...</p>
				</div>
				<FooterOne />
			</>
		);
	}

    return ( 
        <>
		<HeadMeta metaTitle={postContent.title} />
        <HeaderOne />
        <Breadcrumb bCat={postContent.cate} aPage={postContent.title}/>
		<PostFormatStandard postData={postContent} allData={allPosts} />
		<PostSectionSix postData={allPosts} />
        <FooterOne />
        </>
     );
}
 
export default PostDetails;
