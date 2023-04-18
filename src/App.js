import './App.css';
import { Row , Col, Card, Button, Input, Space, message} from 'antd';
import { useState } from 'react';
import axios from 'axios'
import md5 from 'md5'

const tabList = [
  // {
  //   key: 'tab1',
  //   tab: '随机短链',
  //   disable: true,
  // },
  {
    key: 'tab2',
    tab: '自定义短链',
  },
]

function App() {
  const [messageApi, contextHolder] = message.useMessage();
  const [activeTabKey, setActiveTabKey] = useState('tab2')
  const [submitStatus, setSubmitStatus] = useState(false)
  const [data, setData] = useState({
    longUrl: '',
    shortUrl: '',
    password: '',
  })
  const href = window.location.href
  const onTabChange = (key) => {
    setActiveTabKey(key);
  }
  const inputLongUrl = (e) => {
    setData({
      ...data,
      longUrl: e.target.value,
    })
  }
  const inputShortUrl= (e) => {
    setData({
      ...data,
      shortUrl: e.target.value,
    })
  }
  const inputPassword = (e) => {
    setData({
      ...data,
      password: e.target.value,
    })
  }
  const submit = (status) => {
    setSubmitStatus(true)
    let api = href
    axios.post(api, {
      url: data.longUrl,
      key: data.shortUrl,
      hash: md5(data.longUrl + data.password),
    }).then((res)=> {
      setSubmitStatus(false)
      if (res.data.status === 200) {
        messageApi.info('提交成功：' + api + data.shortUrl);
      } else {
        messageApi.error('提交失败：url 不正确或者密码不合法');
      }
    })
  }
  const contentList = {
    tab1:
    <Space style={{width: '80%'}}>

    </Space>,
    tab2:
    <Space direction='vertical' style={{width: '100%'}} size="middle">
      <Space.Compact style={{
        width: '100%',
      }}>
        <Input placeholder="请输入长链" value={data.longUrl} onChange={inputLongUrl}></Input>
      </Space.Compact>
      <Space style={{width: '100%'}} size="middle">
        <Space.Compact style={{
          width: '100%',
        }}>
          <Input addonBefore={href} placeholder="请输入自定义短链" value={data.shortUrl} onChange={inputShortUrl}></Input>
        </Space.Compact>
        <Space.Compact block style={{
          width: '100%',
        }}>
          <Input placeholder="请输入密码" value={data.password} onChange={inputPassword}></Input>
          {contextHolder}
          <Button type='primary' loading={submitStatus} onClick={submit}>提交</Button>
        </Space.Compact>
      </Space>
    </Space>
  };
  return (
    <div className="App">
      <header className="App-header">
        <Row justify="center" align="middle">
          <Col span={24}>
            <Card title="七夜的短链" activeTabKey={activeTabKey} onTabChange={onTabChange} tabList={tabList} bordered={false} style={{ width: "100%" }}>
              {contentList[activeTabKey]}
            </Card>
          </Col>
        </Row>
      </header>
    </div>
  );
}

export default App;
