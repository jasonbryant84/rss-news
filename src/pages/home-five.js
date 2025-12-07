'use client';

import { useState, useEffect } from 'react';
import HeadMeta from "../components/elements/HeadMeta";
import HeaderFive from "../components/header/HeaderFive";
import PostLayoutSix from "../components/post/layout/PostLayoutSix";
import PostVideoThree from "../components/post/layout/PostVideoThree";
import Slider from 'react-slick';
import { useRSSArticles } from "../hooks/useRSSArticles";

const HomeFive = () => {
  const { articles, loading } = useRSSArticles();
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    if (articles && articles.length > 0) {
      setAllPosts(articles);
    }
  }, [articles]);

	const videoPost = allPosts.filter(post => post.postFormat === 'video');

	// Slick Slider Option
	function SlickNextArrow(props) {
		const { className, onClick } = props;
		return (
			<button className={className} onClick={onClick}>
			<i className="feather icon-chevron-right"></i>
			</button>
		);
	}
	
	function SlickPrevArrow(props) {
		const { className, onClick } = props;
		return (
			<button className={className} onClick={onClick}>
			<i className="feather icon-chevron-left"></i>
			</button>
		);
	}
	
	const slideSettings = {
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: true,
		dots: false,
		fade: true,
		nextArrow: <SlickNextArrow />,
		prevArrow: <SlickPrevArrow />,
	};

	if (loading) {
		return (
			<div className="main-content fixed-top">
				<HeadMeta metaTitle="Home Five" />
				<HeaderFive />
				<div className="fluid-post-wrapper p-t-xs-15 p-t-sm-30" style={{ textAlign: 'center', padding: '40px' }}>
					<p>Loading articles...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="main-content fixed-top">
			<HeadMeta metaTitle="Home Five" />
			<HeaderFive />
			{allPosts.length > 0 ? (
				<div className="fluid-post-wrapper p-t-xs-15 p-t-sm-30">
					<div className="container-fluid p-l-md-30 p-r-md-30">
						<div className="row">
							<div className="col-xl-4 col-lg-6">
								<Slider {...slideSettings} className="axil-content axil-post-carousel">
									{videoPost.slice(0, 5).map((data) => (
										<div className="item" key={data.slug}>
											<PostVideoThree data={data} imgWidth={600} imgHeight={760} key={data.slug} />
										</div>
									))}
								</Slider>
							</div>
							<div className="col-xl-8 col-lg-6">
								<div className="y-scroll-container">
									<div className="row gutter-40">
										{allPosts.slice(0, 12).map((data) => (
											<div className="col-xl-4 col-sm-6" key={data.slug}>
												<PostLayoutSix data={data} />
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="fluid-post-wrapper p-t-xs-15 p-t-sm-30" style={{ textAlign: 'center', padding: '40px' }}>
					<p>No articles available</p>
				</div>
			)}
		</div>
	);
}

export default HomeFive;

