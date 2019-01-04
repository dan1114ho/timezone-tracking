import React, { Component } from 'react';
import moment from 'moment';
import { Form } from 'semantic-ui-react';

class NameFilter extends Component {
  render() {
    const { searchTerm, onChange } = this.props;
    return (
      <Form>
        <Form.Input
          label="Timezone Name"
          type="text"
          value={searchTerm}
          onChange={(e) => onChange('searchTerm', e.target.value)}
        />
      </Form>
    );
  }
}

export default NameFilter;
