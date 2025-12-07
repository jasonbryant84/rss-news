import WidgetAd from "../../widget/WidgetAd";
import WidgetInstagram from "../../widget/WidgetInstagram";
import WidgetNewsletter from "../../widget/WidgetNewsletter";
import WidgetPost from "../../widget/WidgetPost";
import MetaDataOne from "./elements/meta/MetaDataOne";
import PostAuthor from "./elements/PostAuthor";


const PostFormatStandard = ({postData, allData}) => {
  const basePathLink = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_BASEPATH ?? "" : "";
  
  let postContent = postData.content.replaceAll('/images/', basePathLink + '/images/');
  
  // Add responsive styling to images and iframes
  postContent = postContent.replace(/<img /g, '<img style="max-width: 100%; height: auto; display: block; margin: 20px 0;" ');
  postContent = postContent.replace(/<iframe /g, '<iframe style="max-width: 100%; width: 100%; height: auto; aspect-ratio: 16/9;" ');

    return (
      <>
        <MetaDataOne metaData={postData} />
        <div className="post-single-wrapper p-t-xs-60">
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <main className="site-main">
                  <article className="post-details">
                    <div className="single-blog-wrapper">
                      <div 
                        className="article-content"
                        dangerouslySetInnerHTML={{__html: postContent}}
                        style={{
                          overflow: 'hidden',
                          wordBreak: 'break-word'
                        }}
                      ></div>
                    </div>
                  </article>
				  <hr className="m-t-xs-50 m-b-xs-60" />
				  <PostAuthor authorData={postData}/>
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
}
 
export default PostFormatStandard;