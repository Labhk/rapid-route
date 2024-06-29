// UploadedPage.js
import fs from 'fs';
import path from 'path';

const UploadedPage = ({ content }) => {
  return (
    <div className="p-4">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export async function getStaticPaths() {
  const uploadsPath = path.join(process.cwd(), 'public', 'up');
  const files = fs.readdirSync(uploadsPath);

  const paths = files.map((file) => ({
    params: { filename: file.replace(/\.html$/, '') },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { filename } = params;
  const filePath = path.join(process.cwd(), 'public', 'up', `${filename}.html`);
  const content = fs.readFileSync(filePath, 'utf-8');

  return {
    props: {
      content,
    },
  };
}

export default UploadedPage;
