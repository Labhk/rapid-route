// UploadedPage.js
import { getDownloadURL, ref, listAll } from 'firebase/storage';
import { storage } from '@/firebase/config'; // Adjust this import path based on your setup

const UploadedPage = ({ content }) => {
  return (
    <div className="">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export async function getStaticPaths() {
  try {
    // Construct reference to the directory in Firebase Storage
    const storageRef = ref(storage, 'uploads');

    // List all items (files) in the 'uploads' directory
    const listResult = await listAll(storageRef);

    // Extract filenames from list result
    const paths = listResult.items.map((item) => ({
      params: { filename: item.name.replace(/\.html$/, '') },
    }));

    return {
      paths,
      fallback: "blocking",
    };
  } catch (error) { 
    console.error('Error fetching static paths:', error);
    return {
      paths: [],
      fallback: "blocking",
    };
  }
}

export async function getStaticProps({ params }) {
  const { filename } = params;
  console.log('filename:', filename);

  try {
    // Construct reference to the file in Firebase Storage
    const storageRef = ref(storage, `uploads/${filename}.html`);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    // Fetch content from the URL
    const response = await fetch(downloadURL);
    const content = await response.text();

    return {
      props: {
        content,
      },
    };
  } catch (error) {
    console.error('Error fetching file content:', error);
    return {
      notFound: true, // Handle file not found gracefully
    };
  }
}

export default UploadedPage;
