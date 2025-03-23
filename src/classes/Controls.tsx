import React from 'react';

class Controls extends React.Component {
    keyboardControls = () => {
        const tableStyle = {
            marginLeft: "auto",
            marginRight: "auto",
            "border": "1px solid black",
        };

        return (
            <div>
                <h2>Keyboard controls</h2>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th>Key</th>
                            <th>Usage</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>Left arrow</th>
                            <th>Horizontal move to the left</th>
                        </tr>
                        <tr>
                            <th>Right arrow</th>
                            <th>Horizontal move to the right</th>
                        </tr>
                        <tr>
                            <th>Top arrow</th>
                            <th>Rotation clockwise</th>
                        </tr>
                        <tr>
                            <th>Down arrow</th>
                            <th>Fall towards the pile</th>
                        </tr>
                        <tr>
                            <th>Spacebar</th>
                            <th>Vertical move to position a piece in a hole in the pile</th>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    };
    

    render() {
        return (
            this.keyboardControls()
        );
    }
}

export default Controls;
