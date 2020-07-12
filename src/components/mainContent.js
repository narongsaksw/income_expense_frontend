import React, { Component } from "react";
import axios from "axios";
import { Link } from 'react-router-dom'
import { Table, Form, Input, InputNumber, Select, DatePicker, Button, Popconfirm, Modal } from 'antd'
import { EditOutlined, CloseOutlined } from '@ant-design/icons'
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

export default class mainContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      amount: 0,
      type_value: '',
      type2_value: '',
      remark: '',
      date1: moment().format("YYYY-MM-DD[T00:00:00.000Z]"),
      date2: moment().format("YYYY-MM-DD[T00:00:00.000Z]"),
      transactions:[],
      show_modal: false,
      transactions_by_id: [],
      amount_by_id: 0,
      remark_by_id:'',
      type_by_id:'',
      date_submit: ''
    };
  }
  formRef = React.createRef();
  async componentDidMount() {
    const user_data = await axios.get(`${api}/users`, { headers: authHeader() })
    this.setState({ user: user_data.data})
    const { type2_value, date1, date2, user } = this.state
    const transactions = await axios.get(`${api}/transactions`, { params: {
        user: user._id,
        type: type2_value,
        date1: date1,
        date2: date2
      } 
    })
    this.setState({
      transactions: transactions.data
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

  onAmountModalChange = (values) => {
    this.setState({ amount_by_id: values })
  }

  onRemarkModalChange = e => {
    this.setState({ remark_by_id: e.target.value })
  }

  onTypeModalChange = (value) => {
     this.setState({ type_by_id: value})  
  }

  onType2Change = (value) => {
     this.setState({ type2_value: value })  
  }

  onDateChange = (date,dateString) => {
    this.setState({ date_submit: dateString })
  }

  _changeDate = async (value) => {
    if(value !== null && value !== undefined && value.length > 1){
     await this.setState({
           date1: value[0]._d,
           date2: value[1]._d
         })
    }
 }

 _modalEdit = async (id) => {
   const transaction_by_id = await axios.get(`${api}/transactions/${id}`) 
   if(transaction_by_id.data.length > 0){
    this.setState({
      transaction_by_id: transaction_by_id.data[0],
      amount_by_id:transaction_by_id.data[0].amount,
      remark_by_id:transaction_by_id.data[0].remark,
      type_by_id:transaction_by_id.data[0].type,
    })
   }
  this.setState({ 
    show_modal : true
  })
 }

 _UpdateRecord = async () => {
   const { amount_by_id, type_by_id, remark_by_id, transaction_by_id } = this.state
   let data ={
    amount: amount_by_id,
    type: type_by_id,
    remark: remark_by_id
   }
   await axios.put(`${api}/transactions/${transaction_by_id._id}`, data)
   this.setState({ show_modal: false })
   this.componentDidMount()
 }

 handleCancel = () => {
   this.setState({ show_modal : false })
 }

 onFilter = async () => {
  const { type2_value, date1, date2, user } = this.state
  let transactions = await axios.get(`${api}/transactions`, 
    { 
      params: {
        user: user._id,
        type: type2_value,
        date1: moment(date1).format("YYYY-MM-DD[T00:00:00.000Z]"),
        date2: moment(date2).format("YYYY-MM-DD[T00:00:00.000Z]")
      } 
    })
      this.setState({ transactions: transactions.data })
 }

  onFinish = async (values,user) => {
       let data = {
          user: user._id,
          amount: values.Amount,
          type: values.Type,
          remark: values.Remark,
          date: moment(values.Date._d).format("YYYY-MM-DD[T00:00:00.000Z]")
      }
    
    await axios.post(`${api}/transactions`, data)
    await this.componentDidMount()
          this.formRef.current.resetFields()
  }

  onDelete = async (id) => {
    await axios.delete(`${api}/transactions/${id}`)
    this.componentDidMount()
  }

  render() {
    const { 
      user, 
      transactions, 
      show_modal, 
      transaction_by_id, 
      amount_by_id, 
      remark_by_id,
      type_by_id
     } = this.state
    var balance_total = 0
    if(transactions.length > 0) {
      let balance = transactions.reduce((sum,transaction) => {
            if(transaction.type === 'Income') {
              return sum + transaction.amount;
            }
            else{
              return sum - transaction.amount
            }
          },0
        )
        balance_total = balance
    }

    let columns = [
      {
        title:'Order No.',
        width:'10%',
        dataIndex:'order',
        key:'order',
        render: (text,record,index) => (
          <span key={index}>
              {index+1}
          </span>
        )
      },
      {
        title:'Date',
        width:'15%',
        dataIndex:'date',
        key:'date',
        editable: true,
        render: (text,record,index) => (
          <span key={index}>
              {moment(record.date).format('DD-MM-YYYY')}
          </span>
        )
      },
      {
        title:'Amount',
        width:'15%',
        dataIndex:'amount',
        key:'amount',
        render: (text,record,index) => (
          <span key={index}>
              {new Intl.NumberFormat().format(record.amount)}
          </span>
        )
      },
      {
        title:'Type',
        width:'15%',
        dataIndex:'type',
        key:'type',
        render: (text,record,index) => (
          <span key={index}>
              {record.type}
          </span>
        )
      },
      {
        title:'Remark',
        width:'20%',
        dataIndex:'remark',
        key:'remark',
        render: (text,record,index) => (
          <span key={index}>
              {record.remark}
          </span>
        )
      },
      {
        title:'Action',
        width:'10%',
        key:'_id',
        dataIndex:'_id',
        render: (record) => (
          <span>
            <EditOutlined
              onClick = {() => this._modalEdit(record)}
            />
            <Popconfirm 
              title='Sure to Cancel ? ' 
              onConfirm={() => this.onDelete(record)}>
                <CloseOutlined style={{ marginLeft: '10px', color: 'red' }} />
            </Popconfirm>
          </span>
        )
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
                  <Form 
                    ref={this.formRef} 
                    {...formItemLayout} 
                    onFinish={values => this.onFinish(values,user)}>
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
              <label style={{marginTop:8}}>Balance:</label>
                <Input 
                  style={{width:'15%', marginLeft:10,marginRight:10}} 
                  defaultValue={0}  
                  readOnly
                  value={new Intl.NumberFormat().format(balance_total)}
                />
                <Select
                  style={{width:200, marginRight:15}}
                  onChange={this.onType2Change}
                  placeholder="Select"
                  defaultValue=""
                >
                  <Option key="income" value="Income">Income</Option>
                  <Option key="expense" value="Expense">Expense</Option>
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
                rowKey="columns"
                columns={columns}
                pagination={15}
                dataSource={transactions}
              />
              {transaction_by_id === undefined ? null : (
                <Modal
                  visible={show_modal}
                  onOk = {this._UpdateRecord}
                  onCancel={this.handleCancel}
                  okText='Save'
              >
                <div className="auth-wrapper">
                <div className="auth-inner">
                <h3>Edit</h3>
                <InputNumber
                  value={amount_by_id}
                  style={{marginBottom:24}}
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')} 
                  min={0}
                  onChange={this.onAmountModalChange}
                />
                <Input
                  value={remark_by_id}
                  style={{marginBottom:24}}
                  onChange={this.onRemarkModalChange}
                />
                <Select
                  style={{marginBottom:24, width:200}}
                  onChange={this.onTypeModalChange}
                  placeholder="Select"
                  value={type_by_id}
                >
                  <Option key="income" value="Income">Income</Option>
                  <Option key="expense" value="Expense">Expense</Option>
                </Select>
                </div>
                </div>
              </Modal>
              )}
            </div>
          </div>
        </div>  
      </div>
    );
  }
}

