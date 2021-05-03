import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  header {
    height: 144px;
    background: #28262e;

    display: flex;
    align-items: center;

    div {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;

      svg {
        width: 24px;
        height: 24px;
        color: #999591;
      }
    }
  }
`;
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  place-content: center;

  width: 100%;
  max-width: 700px;
  margin: -175px auto 0;
  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    h1 {
      width: 100%;
      margin-bottom: 24px;
      font-size: 20px;
      text-align: left;
    }
  }
  > a {
    color: #ff9000;
    display: block;
    margin-top: 24px;
    text-decoration: none;
    transition: color 0.2s;

    display: flex;
    align-items: center;

    svg {
      margin-right: 16px;
    }
    &:hover {
      color: ${shade(0.2, '#ff9000')};
    }
  }
`;

export const AvatarInput = styled.div`
  margin-bottom: 32px;
  position: relative;
  width: 186px;
  align-self: center;

  img {
    width: 186px;
    height: 186px;
    border-radius: 50%;
  }
  label {
    position: absolute;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    right: 0;
    bottom: 0;
    background: #ff9000;
    border: 0;
    cursor: pointer;
    transition: background-color 0.2s;

    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: ${shade(0.2, '#ff9000')};
    }
    svg {
      width: 20px;
      height: 20px;
      color: #312e38;
    }
    input {
      display: none;
    }
  }
`;
