// TODO: fix design token
export const token = {
  light: '#ffffff',
  dark: '#09090b',
  brand: '#09090b',
};

export const gutter = 20;

export const logo = {
  borderRadius: 21,
  width: 42,
  height: 42,
};

export const fontFamily =
  '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif';

export const main = {
  backgroundColor: token.light,
  paddingLeft: 20,
  paddingRight: 20,
};

export const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '560px',
  textAlign: 'left' as const,
};

export const buttonContainer = {
  margin: '20px 0',
};

export const hr = {
  borderColor: token.dark,
  margin: '30px 0',
  opacity: 0.2,
};

export const code = {
  fontFamily: 'monospace',
  fontWeight: '700',
  padding: '1px 4px',
  backgroundColor: '#dfe1e4',
  letterSpacing: '-0.3px',
  fontSize: '21px',
  borderRadius: '4px',
  color: '#3c4149',
};
