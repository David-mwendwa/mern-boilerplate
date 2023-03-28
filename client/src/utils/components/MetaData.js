import { Helmet } from 'react-helmet';

/**
 * Dynamically set document's title on head section
 * @param {*} title string to be parsed as a title
 * @returns react component with updated head title
 * @example <MetaData title='About page' />
 */
const Metadata = ({ title }) => {
  return (
    <Helmet>
      <title>{`${title} | <app-name>`}</title>
    </Helmet>
  );
};

export default Metadata;
