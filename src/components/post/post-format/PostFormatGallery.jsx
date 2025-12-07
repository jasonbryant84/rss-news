import Image from "next/image";
import dynamic from "next/dynamic";
import WidgetAd from "../../widget/WidgetAd";
import WidgetInstagram from "../../widget/WidgetInstagram";
import WidgetNewsletter from "../../widget/WidgetNewsletter";
import WidgetPost from "../../widget/WidgetPost";
import MetaDataThree from "./elements/meta/MetaDataThree";
import PostAuthor from "./elements/PostAuthor";

const Masonry = dynamic(() => import('react-responsive-masonry').then(mod => mod.default), { ssr: false });

const PostFormatGallery = ({ postData, allData }) => {
  const basePathLink = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_BASEPATH ?? "" : "";
  
  const postContent = postData.content.replaceAll('/images/', basePathLink + '/images/');

  return (
    <>
      <MetaDataThree metaData={postData} />
      <div className="post-single-wrapper p-t-xs-60">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <main className="site-main">
                <article className="post-details">
                  <div className="single-blog-wrapper">
                    <ul className="masonry-grid gallery">
						<Masonry columnsCount={3} gutter="0 10px">
							{postData.gallery.slice(0, 4).map((data, index) => (
							<li className="grid-item" key={index}>
								<figure>
									<Image 
									src={data}
									alt="Image"
									width={237}
									height={index == 0 || index == 3 ? 139 : 287 }
									/>
								</figure>
							</li>
							))}
						</Masonry>
                    </ul>
                    <div
                      dangerouslySetInnerHTML={{ __html: postContent }}
                    ></div>
                  </div>
                </article>
                <hr className="m-t-xs-50 m-b-xs-60" />
                <PostAuthor authorData={postData} />
              </main>
            </div>
            <div className="col-lg-4">
              <div className="post-sidebar">
                <WidgetAd />
                <WidgetNewsletter />
                <WidgetPost dataPost={allData} />
                <WidgetInstagram />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostFormatGallery;
