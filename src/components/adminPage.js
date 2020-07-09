import React, { Component } from "react";
import axios from "axios";
import { Link } from 'react-router-dom'
import { Table, Form, Input, InputNumber, Select, DatePicker, Button } from 'antd'
import moment from 'moment';

import authHeader from '../services/auth-header';
const { Option } = Select;
const { RangePicker } = DatePicker;
const formItemLayout = {
  labelcol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrappercol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrappercol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
const config = {
  rules: [
    {
      type: 'object',
      required: true,
      message: 'Please select date!',
    },
  ],
};
const api = 'http://localhost:8080'

export default class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      amount: 0,
      type_value: '',
      type2_value: '',
      date_value:'',
      remark: '',
      date1: moment().format("DD-MM-YYYY"),
      date2: moment().format("DD-MM-YYYY"),
      transactions:[]
    };
  }

  componentDidMount() {
    axios.get(`${api}/users`, { headers: authHeader() })
    .then(res => {
        this.setState({
            user: res.data
        })
    })
    const { type2_value, date1, date2 } = this.state
    axios.get(`${api}/transactions`, { params: {
      type: type2_value,
      date1: date1,
      date2: date2
    } })
    .then(res => {
        this.setState({
            transactions: res.data
        })
    })
  }

  logOut = () => {
    localStorage.removeItem('user');
  }

  onAmountChange = values => {
    this.setState({ amount: values })
  }

  onRemarkChange = e => {
    this.setState({ remark: e.target.value })
  }

  onTypeChange = (value) => {
     this.setState({ type_value: value})  
  }
  onType2Change = (value) => {
     this.setState({ type2_value: value})  
  }

  onDateChange = (date,dateString) => {
    this.setState({ date_type: dateString})
  }

  _changeDate = async (value) => {
    if(value !== undefined && value.length > 1){
     await this.setState({
           date1: value[0]._d,
           date2: value[1]._d
         })
    }
 }

 onFilter = () => {
  const { type2_value, date1, date2 } = this.state
  axios.get(`${api}/transactions`, 
    { 
      params: {
        type: type2_value,
        date1: date1,
        date2: date2
      } 
    })
    .then(res => { this.setState({ transactions: res.data }) })
    console.log(this.state.transactions);
    
 }

  onFinish = (values,user) => {
       let data = {
          user: user._id,
          amount: values.Amount,
          type: values.Type,
          remark: values.Remark,
          date: values.Date._d
      }
    
    axios.post(`${api}/transactions`, data , { headers: authHeader() })
    .then(res => {
      return res
    })
  }

  render() {
    const { user, transactions } = this.state
    console.log(transactions);
    
    let columns = [
      {
        title:'Order No.',
        width:'15%'
      },
      {
        title:'Date',
        width:'30%' 
      },
      {
        title:'Amount',
        width:'20%'
      },
      {
        title:'Type',
        width:'15%'
      },
      {
        title:'Remark',
        width:'20%'
      }
    ]
    return (
      <div className='App'>
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <Link className="navbar-brand" to={"/sign-in"}>Income & Expense</Link>
              <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link className="nav-link" to={"/sign-in"} onClick={this.logOut}>LogOut</Link>
                  </li>
                </ul>
              </div>
          </div>
        </nav>

        <div className="auth-wrapper">
          <div className="row">
            <div className="col-4">
              <div className="auth-inner">
                <h3>Form</h3>
                  <Form {...formItemLayout} onFinish={values => this.onFinish(values,user)}>
                    <Form.Item 
                      label="Amount" 
                      name="Amount"
                      rules={[
                        {
                          required: true,
                          message: 'Please input your Amount!',
                        },
                      ]}
                      >
                      <InputNumber 
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')} 
                        min={0} 
                        onChange={this.onAmountChange}/>
                    </Form.Item>
                    <Form.Item label="Remark" name="Remark">
                      <Input onChange={this.onRemarkChange}/>
                    </Form.Item>
                    <Form.Item 
                      label="Type" 
                      name="Type"
                      rules={[
                        {
                          required: true,
                          message: 'Please select type!',
                        },
                      ]}
                      >
                      <Select
                        onChange={this.onTypeChange}
                        placeholder="Select"
                      >
                        <Option key="income" value="Income">Income</Option>
                        <Option key="expense" value="Expense">Expense</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item 
                      label="Date" 
                      name="Date"
                      {...config}
                      >
                        <DatePicker
                          onChange={this.onDateChange}/>
                    </Form.Item>
                    <Form.Item>
                      <Button 
                        {...tailFormItemLayout}
                        style={{marginLeft:135,marginRight:135}} 
                        type="primary" 
                        htmlType="submit">
                          Save
                      </Button>
                    </Form.Item>
                  </Form> 
              </div>
            </div>

            <div className="col-7">
              <div className="row" style={{margin:0,paddingBottom:15}}>
                <Select
                  style={{width:200, marginRight:15}}
                  onChange={this.onType2Change}
                  placeholder="Select"
                  defaultValue=""
                >
                  <Option key="income" value="income">Income</Option>
                  <Option key="expense" value="expense">Expense</Option>
                  <Option key="all" value="">All</Option>
                </Select>
                <RangePicker
                  format='DD-MM-YYYY'
                  defaultValue={[moment(),moment()]}
                  onCalendarChange={this._changeDate}
                />
                <Button 
                  style={{marginLeft:15}} 
                  type="primary"
                  onClick={this.onFilter}
                  >Filter</Button>
              </div>
              
              <Table
                columns={columns}
                pagination={15}
              />
            </div>
          </div>
        </div>  
      </div>
    );
  }
}
