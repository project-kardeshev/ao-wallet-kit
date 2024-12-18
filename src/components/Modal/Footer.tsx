import { styled } from '@linaria/react';
import { PropsWithChildren } from 'react';

import { DefaultTheme, withTheme } from '../../theme';

export function Footer({ children }: PropsWithChildren<unknown>) {
  return <Wrapper>{children}</Wrapper>;
}

const Wrapper = withTheme(styled.div<{ theme: DefaultTheme }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border-top: 1px solid rgb(${(props) => props.theme.light});
  transition: border-color 0.23s ease-in-out;
`);
