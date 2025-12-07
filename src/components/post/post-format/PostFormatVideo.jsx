import WidgetAd from "../../widget/WidgetAd";
import WidgetInstagram from "../../widget/WidgetInstagram";
import WidgetNewsletter from "../../widget/WidgetNewsletter";
import WidgetPost from "../../widget/WidgetPost";
import MetaDataTwo from "./elements/meta/MetaDataTwo";
import PostAuthor from "./elements/PostAuthor";

const PostFormatVideo = ({ postData, allData }) => {
  const basePathLink = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_BASEPATH ?? "" : "";
  
  const postContent = postData.content.replaceAll('/images/', basePathLink + '/images/');
  return (
    <>
      <MetaDataTwo metaData={postData} allPost={allData} />
      <div className="post-single-wrapper p-t-xs-60">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <main className="site-main">
                <article className="post-details">
                  <div className="single-blog-wrapper">
                    <figure className="post-media">
                      <video className="plyr-post" id="video-player-1" playsInline controls >
                        <source
                          src={basePathLink + postData.videoLink}
                          type="video/mp4"
                        />
                      </video>
                    </figure>
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

export default PostFormatVideo;
