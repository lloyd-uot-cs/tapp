import React from 'react'
import { Panel, ListGroup, ListGroupItem } from 'react-bootstrap'

class CourseList extends React.Component {
  constructor(props){
    super(props);
  }

  setCourseList(){
    if(!this.props.func.isFetching()){
      let courses = this.props.courses.list;
      return(
        Object.entries(courses).map((course, key) =>(
            <ListGroupItem key={key} className="course_list_item"
               href={"#"+course[0]}>
               {course[1].code}
            </ListGroupItem>
        ))
      );
    }
  }

  render(){
    return(
      <Panel style={{width: '12em', float: 'left', margin: '0', height: '88vh'}}
        header="Courses">
        <ListGroup style={{height: 'calc(100% - 30px)', overflow: 'auto'}} fill>
            {this.setCourseList()}
        </ListGroup>
      </Panel>
    );
  }
}

export { CourseList };