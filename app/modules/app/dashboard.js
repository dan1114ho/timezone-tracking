import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { Table, Container, Dimmer, Loader } from 'semantic-ui-react';
import { recordListRequest } from './record/redux/actions';
import { makeSelectRecordList, makeSelectRecordListLoading } from './record/redux/selectors';

class Dashboard extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      limit: 10,
    };
  }

  render() {
    const { loading } = this.props;

    return (
      <Container>
        <Dimmer active={loading}>
          <Loader />
        </Dimmer>
        <h1>Welcome to Application</h1>
        <h2>Please click <Link to="/records">here</Link> to see the timezones</h2>
      </Container>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectRecordListLoading(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(Dashboard);
