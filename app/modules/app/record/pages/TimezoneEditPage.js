import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import moment from 'moment';
import { Link, withRouter } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { createStructuredSelector } from 'reselect';
import { Header, Segment, Container, Form, Button, Dimmer, Loader } from 'semantic-ui-react';
import {
  recordLoadRequest,
  updateRecordField,
  recordSaveRequest,
  loadNewRecord,
} from '../redux/actions';
import { makeSelectRecord, makeSelectRecordLoading } from '../redux/selectors';

class TimezonePage extends Component {
  componentWillMount() {
    this.loadRecord(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.loadRecord(nextProps.match.params.id);
    }
  }

  onSubmit = () => {
    this.props.recordSave();
    this.props.history.push('../records');
  }

  onUpdateField = (field) => (evt) => {
    this.props.updateField(field, evt.target.value);
  }

  onChangeDate = (date) => {
    this.props.updateField('date', date);
  }

  loadRecord = (id) => {
    const { recordLoad } = this.props;
    if (id === 'new') {
      this.props.loadNewRecord();
    } else {
      recordLoad(id);
    }
  }

  render() {
    const { record, loading } = this.props;

    return (
      <Container fluid>
        <Dimmer active={loading}>
          <Loader />
        </Dimmer>
        <Header as="h2" content={record.get('id') ? 'Edit Timezone' : 'New Timezone'} color="teal" />
        <Form onSubmit={this.onSubmit}>
          <Segment>
            <Header as="h4" content="Timezone Info" dividing color="teal" />
            <Form.Input
              label="Timezone Name"
              type="text"
              required
              value={record.get('name') || ''}
              onChange={this.onUpdateField('name')}
            />
            <Form.Input
              label="City"
              type="text"
              required
              value={record.get('city') || ''}
              onChange={this.onUpdateField('city')}
            />
            <Form.Input
              label="Difference to GMT(hours)"
              type="text"
              required
              value={record.get('difference') || ''}
              onChange={this.onUpdateField('difference')}
            />
          </Segment>
          <Button color="teal">Save</Button>&nbsp;&nbsp;
          <Link to="/records">Cancel</Link>
        </Form>
      </Container>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  record: makeSelectRecord(),
  loading: makeSelectRecordLoading(),
});

const mapDispatchToProps = {
  recordLoad: recordLoadRequest,
  updateField: updateRecordField,
  recordSave: recordSaveRequest,
  loadNewRecord,
};

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, withRouter)(TimezonePage);
